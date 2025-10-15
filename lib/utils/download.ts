/**
 * Utility functions for downloading design data and images
 */

import JSZip from 'jszip';
import { Design, DesignOutput } from '@/lib/generated/prisma';

export interface DesignDownloadData {
  design: Design;
  outputs: DesignOutput[];
  roiAnalysis?: string | null;
}

/**
 * Downloads all images for a design as a ZIP file
 */
export async function downloadDesignImages(
  design: Design,
  outputs: DesignOutput[]
): Promise<void> {
  try {
    const zip = new JSZip();
    const folder = zip.folder(`design-${design.id.slice(0, 8)}`);
    
    if (!folder) {
      throw new Error('Failed to create ZIP folder');
    }

    // Download each image and add to ZIP
    for (let i = 0; i < outputs.length; i++) {
      const output = outputs[i];
      if (!output.outputImageUrl) continue;

      try {
        let blob: Blob;
        let extension = 'png';

        // Check if it's a base64 data URL
        if (output.outputImageUrl.startsWith('data:image')) {
          // Extract mime type and base64 data
          const matches = output.outputImageUrl.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
          if (matches) {
            extension = matches[1];
            const base64Data = matches[2];

            // Convert base64 to binary
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let j = 0; j < binaryString.length; j++) {
              bytes[j] = binaryString.charCodeAt(j);
            }

            blob = new Blob([bytes], { type: `image/${extension}` });
          } else {
            console.error(`Failed to parse base64 data URL for image ${i}`);
            continue;
          }
        } else {
          // Regular URL - fetch it
          const response = await fetch(output.outputImageUrl);
          if (!response.ok) continue;

          blob = await response.blob();
          extension = blob.type.split('/')[1] || 'png';
        }

        const filename = `${output.variationName || `image-${i + 1}`}.${extension}`;
        folder.file(filename, blob);
      } catch (error) {
        console.error(`Failed to download image ${i}:`, error);
      }
    }

    // Generate ZIP file
    const content = await zip.generateAsync({ type: 'blob' });
    
    // Trigger download
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `design-${design.id.slice(0, 8)}-images.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download images:', error);
    throw new Error('Failed to download images');
  }
}

/**
 * Downloads design data including images and ROI analysis as a complete package
 * This function first fetches fresh signed URLs from the API before downloading
 */
export async function downloadDesignPackage(
  design: Design,
  outputs: DesignOutput[],
  roiAnalysis?: string | null
): Promise<void> {
  try {
    // First, fetch fresh download data with signed URLs from the API
    console.log('📡 Fetching fresh download data from API...');
    console.log('   API endpoint:', `/api/designs/${design.id}/download`);

    const response = await fetch(`/api/designs/${design.id}/download`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API request failed:', response.status, response.statusText);
      console.error('   Error response:', errorText);
      throw new Error(`Failed to fetch download data: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('📦 API Response received:', {
      success: responseData.success,
      hasDesign: !!responseData.design,
      outputsCount: responseData.design?.designOutputs?.length || 0,
    });

    const { success, design: freshDesign } = responseData;

    if (!success || !freshDesign) {
      console.error('❌ Invalid response from API:', responseData);
      throw new Error('Invalid download data received');
    }

    console.log('✅ Fresh download data received');
    console.log('   Design ID:', freshDesign.id);
    console.log('   Outputs count:', freshDesign.designOutputs?.length || 0);

    // Use fresh data with signed URLs
    const finalOutputs = freshDesign.designOutputs || outputs;
    const finalROI = freshDesign.roiNotes || roiAnalysis;

    const zip = new JSZip();
    const folderName = `design-${design.id.slice(0, 8)}`;
    const folder = zip.folder(folderName);
    
    if (!folder) {
      throw new Error('Failed to create ZIP folder');
    }

    // Add design metadata as JSON
    const metadata = {
      id: design.id,
      title: design.title,
      description: design.description,
      status: design.status,
      roomType: design.roomType,
      size: design.size,
      style: design.style,
      budget: design.budget,
      colorScheme: design.colorScheme,
      customRequirements: design.customRequirements,
      createdAt: design.createdAt,
      updatedAt: design.updatedAt,
      generationNumber: design.generationNumber,
      outputCount: outputs.length,
    };
    
    folder.file('metadata.json', JSON.stringify(metadata, null, 2));

    // Add ROI analysis if available
    if (finalROI) {
      folder.file('roi-analysis.txt', finalROI);
      
      // Also create a formatted markdown version
      const markdownContent = `# ROI Analysis for Design ${design.id.slice(0, 8)}

## Design Details
- **Room Type:** ${design.roomType}
- **Room Size:** ${design.size}
- **Style:** ${design.style}
- **Budget:** ${design.budget ? `$${design.budget}` : 'Not specified'}
- **Created:** ${new Date(design.createdAt).toLocaleDateString()}

## Financial Analysis

${finalROI}

---
*Generated by InnDesign AI*
`;
      folder.file('roi-analysis.md', markdownContent);
    }

    // Download each image and add to images subfolder
    console.log('\n📥 Starting image downloads...');
    console.log(`   Total images to download: ${finalOutputs.length}`);

    let successCount = 0;
    let failCount = 0;
    const imagesFolder = folder.folder('images');

    if (imagesFolder) {
      for (let i = 0; i < finalOutputs.length; i++) {
        const output = finalOutputs[i];
        console.log(`\n[${i + 1}/${finalOutputs.length}] Processing: ${output.variationName || `image-${i + 1}`}`);

        if (!output.outputImageUrl) {
          console.warn(`   ⚠️ Skipping - no URL provided`);
          continue;
        }

        try {
          let blob: Blob;
          let extension = 'png';

          // Check if it's a base64 data URL
          if (output.outputImageUrl.startsWith('data:image')) {
            console.log(`   📸 Type: Base64 data URL`);
            console.log(`   🔍 Data size: ${output.outputImageUrl.length} characters`);

            // Extract mime type and base64 data
            const matches = output.outputImageUrl.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
            if (matches) {
              extension = matches[1];
              const base64Data = matches[2];

              // Convert base64 to binary
              const binaryString = atob(base64Data);
              const bytes = new Uint8Array(binaryString.length);
              for (let j = 0; j < binaryString.length; j++) {
                bytes[j] = binaryString.charCodeAt(j);
              }

              blob = new Blob([bytes], { type: `image/${extension}` });
              console.log(`   ✅ Converted to blob (${(blob.size / 1024).toFixed(2)} KB)`);
            } else {
              console.error(`   ❌ Failed to parse base64 data URL`);
              continue;
            }
          } else {
            // Regular URL - fetch it
            console.log(`🌐 Fetching image ${i + 1} from URL:`, output.outputImageUrl.substring(0, 100));

            try {
              // Try fetching with CORS first
              const response = await fetch(output.outputImageUrl, {
                mode: 'cors',
                credentials: 'same-origin',
              });

              if (!response.ok) {
                console.error(`❌ Failed to fetch image ${i + 1}: ${response.status} ${response.statusText}`);
                console.error(`   URL was: ${output.outputImageUrl.substring(0, 100)}...`);

                // If CORS fails, try fetching through our proxy API
                console.log(`   🔄 Trying to fetch through proxy...`);
                const proxyUrl = `/api/designs/${design.id}/proxy-image?url=${encodeURIComponent(output.outputImageUrl)}`;
                const proxyResponse = await fetch(proxyUrl);

                if (!proxyResponse.ok) {
                  console.error(`   ❌ Proxy also failed: ${proxyResponse.status}`);
                  continue;
                }

                blob = await proxyResponse.blob();
                extension = blob.type.split('/')[1] || 'png';
                console.log(`   ✅ Downloaded via proxy (${(blob.size / 1024).toFixed(2)} KB)`);
              } else {
                blob = await response.blob();
                extension = blob.type.split('/')[1] || 'png';
                console.log(`   ✅ Downloaded directly (${(blob.size / 1024).toFixed(2)} KB)`);
              }
            } catch (fetchError) {
              console.error(`❌ Network error fetching image ${i + 1}:`, fetchError);
              console.error(`   URL was: ${output.outputImageUrl.substring(0, 100)}...`);

              // Last resort: try proxy
              try {
                console.log(`   🔄 Final attempt through proxy...`);
                const proxyUrl = `/api/designs/${design.id}/proxy-image?url=${encodeURIComponent(output.outputImageUrl)}`;
                const proxyResponse = await fetch(proxyUrl);

                if (proxyResponse.ok) {
                  blob = await proxyResponse.blob();
                  extension = blob.type.split('/')[1] || 'png';
                  console.log(`   ✅ Downloaded via proxy on retry (${(blob.size / 1024).toFixed(2)} KB)`);
                } else {
                  console.error(`   ❌ All fetch attempts failed`);
                  continue;
                }
              } catch (proxyError) {
                console.error(`   ❌ Proxy fetch also failed:`, proxyError);
                continue;
              }
            }
          }

          const filename = `${output.variationName || `image-${i + 1}`}.${extension}`;
          imagesFolder.file(filename, blob);
          successCount++;
          console.log(`   ✅ Added to ZIP: ${filename}`);
        } catch (error) {
          failCount++;
          console.error(`   ❌ Failed to process image:`, error);
        }
      }
    }

    console.log('\n📊 Download Summary:');
    console.log(`   ✅ Successful: ${successCount}/${finalOutputs.length}`);
    console.log(`   ❌ Failed: ${failCount}/${finalOutputs.length}`);

    // Add a README file
    const readme = `# Design Package: ${design.title || design.id.slice(0, 8)}

This package contains all generated design outputs and analysis.

## Contents

- \`metadata.json\` - Design configuration and metadata
- \`roi-analysis.txt\` - Financial analysis and ROI projections (if available)
- \`roi-analysis.md\` - Formatted ROI analysis (if available)
- \`images/\` - All generated design images

## Design Information

**Description:** ${design.description}

**Room Details:**
- Type: ${design.roomType}
- Size: ${design.size}
- Style: ${design.style}

**Generated:** ${new Date(design.createdAt).toLocaleString()}

---
Generated by InnDesign AI
`;
    
    folder.file('README.md', readme);

    // Generate ZIP file
    const content = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    });
    
    // Trigger download
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${folderName}-complete.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download design package:', error);
    throw new Error('Failed to download design package');
  }
}

/**
 * Downloads ROI analysis as a text file
 */
export async function downloadROIAnalysis(
  design: Design,
  roiAnalysis: string
): Promise<void> {
  try {
    const content = `ROI Analysis for Design ${design.id.slice(0, 8)}
Generated: ${new Date().toLocaleString()}

Design Details:
- Room Type: ${design.roomType}
- Room Size: ${design.size}
- Style: ${design.style}
- Budget: ${design.budget ? `$${design.budget}` : 'Not specified'}

${roiAnalysis}

---
Generated by InnDesign AI
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `design-${design.id.slice(0, 8)}-roi-analysis.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download ROI analysis:', error);
    throw new Error('Failed to download ROI analysis');
  }
}
