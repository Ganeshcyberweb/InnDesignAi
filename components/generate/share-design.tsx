'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

import {
  Share2,
  Copy,
  Mail,
  MessageSquare,
  Download,
  Lock,
  Eye,
  Calendar,
  ExternalLink,
  Check,
  Globe,
  Twitter,
  Facebook,
  Linkedin
} from 'lucide-react'

import type { DesignWithRelations, DesignShare } from '@/app/types/design'

interface ShareDesignProps {
  design: DesignWithRelations
  isOpen: boolean
  onClose: () => void
  onShareCreate?: (shareData: Partial<DesignShare>) => Promise<DesignShare>
}

export function ShareDesign({ design, isOpen, onClose, onShareCreate }: ShareDesignProps) {
  const [shareSettings, setShareSettings] = useState({
    password_protected: false,
    allow_download: true,
    expires_in_days: 30,
    custom_message: ''
  })
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCreateShare = async () => {
    if (!onShareCreate) return

    setIsCreating(true)
    try {
      const expiresAt = shareSettings.expires_in_days
        ? new Date(Date.now() + shareSettings.expires_in_days * 24 * 60 * 60 * 1000)
        : undefined

      const shareData = await onShareCreate({
        design_id: design.id,
        password_protected: shareSettings.password_protected,
        allow_download: shareSettings.allow_download,
        expires_at: expiresAt
      })

      setShareLink(shareData.public_url)
      toast.success('Share link created successfully!')
    } catch (error) {
      console.error('Error creating share link:', error)
      toast.error('Failed to create share link')
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      toast.error('Failed to copy link')
    }
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this interior design: ${design.input_prompt?.substring(0, 50) || 'AI Generated Design'}`)
    const body = encodeURIComponent(
      `I wanted to share this amazing interior design I created with InnDesign AI:\n\n${shareSettings.custom_message}\n\nView the design: ${shareLink}`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const shareViaSocial = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    if (!shareLink) return

    const text = `Check out this amazing interior design I created with AI! ${shareSettings.custom_message}`

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareLink)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`
    }

    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  const handleClose = () => {
    setShareLink(null)
    setShareSettings({
      password_protected: false,
      allow_download: true,
      expires_in_days: 30,
      custom_message: ''
    })
    onClose()
  }

  const getThumbnail = () => {
    if (design.design_outputs && design.design_outputs.length > 0) {
      return design.design_outputs[0].output_image_url
    }
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Share Design</span>
          </DialogTitle>
          <DialogDescription>
            Create a shareable link for your interior design
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Design Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {getThumbnail() ? (
                    <img
                      src={getThumbnail()!}
                      alt="Design preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Eye className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">
                    {design.input_prompt?.substring(0, 60) || 'AI Generated Design'}
                    {design.input_prompt && design.input_prompt.length > 60 && '...'}
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {design.preferences?.room_type && (
                      <Badge variant="secondary" className="text-xs">
                        {design.preferences.room_type}
                      </Badge>
                    )}
                    {design.preferences?.style_preference && (
                      <Badge variant="secondary" className="text-xs">
                        {design.preferences.style_preference}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {design.design_outputs.length} variations generated
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <AnimatePresence mode="wait">
            {!shareLink ? (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Share Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium">Share Settings</h4>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Allow Downloads</Label>
                        <p className="text-xs text-muted-foreground">
                          Let viewers download high-resolution images
                        </p>
                      </div>
                      <Switch
                        checked={shareSettings.allow_download}
                        onCheckedChange={(checked) =>
                          setShareSettings(prev => ({ ...prev, allow_download: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Password Protection</Label>
                        <p className="text-xs text-muted-foreground">
                          Require a password to view the design
                        </p>
                      </div>
                      <Switch
                        checked={shareSettings.password_protected}
                        onCheckedChange={(checked) =>
                          setShareSettings(prev => ({ ...prev, password_protected: checked }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Expires In</span>
                      </Label>
                      <select
                        value={shareSettings.expires_in_days}
                        onChange={(e) =>
                          setShareSettings(prev => ({
                            ...prev,
                            expires_in_days: Number(e.target.value)
                          }))
                        }
                        className="w-full p-2 border rounded-md text-sm"
                      >
                        <option value={1}>1 day</option>
                        <option value={7}>1 week</option>
                        <option value={30}>1 month</option>
                        <option value={90}>3 months</option>
                        <option value={0}>Never</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Custom Message (Optional)</Label>
                      <Textarea
                        placeholder="Add a personal message to share with your design..."
                        value={shareSettings.custom_message}
                        onChange={(e) =>
                          setShareSettings(prev => ({ ...prev, custom_message: e.target.value }))
                        }
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sharing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Share Link */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>Share Link</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={shareLink}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(shareLink)}
                      className="px-3"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(shareLink, '_blank')}
                      className="px-3"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Share Options */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Share Via</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={shareViaEmail}
                      className="flex items-center space-x-2"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => shareViaSocial('twitter')}
                      className="flex items-center space-x-2"
                    >
                      <Twitter className="h-4 w-4" />
                      <span>Twitter</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => shareViaSocial('facebook')}
                      className="flex items-center space-x-2"
                    >
                      <Facebook className="h-4 w-4" />
                      <span>Facebook</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => shareViaSocial('linkedin')}
                      className="flex items-center space-x-2"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </Button>
                  </div>
                </div>

                {/* Share Settings Summary */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Share Settings</h5>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {shareSettings.allow_download ? (
                            <>
                              <Download className="h-3 w-3 mr-1" />
                              Downloads Enabled
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3 mr-1" />
                              Downloads Disabled
                            </>
                          )}
                        </Badge>
                        {shareSettings.password_protected && (
                          <Badge variant="outline" className="text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Password Protected
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {shareSettings.expires_in_days === 0
                            ? 'Never Expires'
                            : `Expires in ${shareSettings.expires_in_days} days`
                          }
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter>
          {!shareLink ? (
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleCreateShare} disabled={isCreating}>
                {isCreating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Creating Link...</span>
                  </div>
                ) : (
                  'Create Share Link'
                )}
              </Button>
            </div>
          ) : (
            <Button onClick={handleClose}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}