
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Profile
 * 
 */
export type Profile = $Result.DefaultSelection<Prisma.$ProfilePayload>
/**
 * Model Design
 * 
 */
export type Design = $Result.DefaultSelection<Prisma.$DesignPayload>
/**
 * Model Preferences
 * 
 */
export type Preferences = $Result.DefaultSelection<Prisma.$PreferencesPayload>
/**
 * Model DesignOutput
 * 
 */
export type DesignOutput = $Result.DefaultSelection<Prisma.$DesignOutputPayload>
/**
 * Model RoiCalculation
 * 
 */
export type RoiCalculation = $Result.DefaultSelection<Prisma.$RoiCalculationPayload>
/**
 * Model Feedback
 * 
 */
export type Feedback = $Result.DefaultSelection<Prisma.$FeedbackPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  CLIENT: 'CLIENT',
  DESIGNER: 'DESIGNER',
  ADMIN: 'ADMIN'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const DesignStatus: {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  ARCHIVED: 'ARCHIVED'
};

export type DesignStatus = (typeof DesignStatus)[keyof typeof DesignStatus]


export const FeedbackType: {
  GENERAL: 'GENERAL',
  QUALITY: 'QUALITY',
  ACCURACY: 'ACCURACY',
  USABILITY: 'USABILITY',
  FEATURE_REQUEST: 'FEATURE_REQUEST',
  BUG_REPORT: 'BUG_REPORT'
};

export type FeedbackType = (typeof FeedbackType)[keyof typeof FeedbackType]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type DesignStatus = $Enums.DesignStatus

export const DesignStatus: typeof $Enums.DesignStatus

export type FeedbackType = $Enums.FeedbackType

export const FeedbackType: typeof $Enums.FeedbackType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Profiles
 * const profiles = await prisma.profile.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Profiles
   * const profiles = await prisma.profile.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.profile`: Exposes CRUD operations for the **Profile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Profiles
    * const profiles = await prisma.profile.findMany()
    * ```
    */
  get profile(): Prisma.ProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.design`: Exposes CRUD operations for the **Design** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Designs
    * const designs = await prisma.design.findMany()
    * ```
    */
  get design(): Prisma.DesignDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.preferences`: Exposes CRUD operations for the **Preferences** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Preferences
    * const preferences = await prisma.preferences.findMany()
    * ```
    */
  get preferences(): Prisma.PreferencesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.designOutput`: Exposes CRUD operations for the **DesignOutput** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DesignOutputs
    * const designOutputs = await prisma.designOutput.findMany()
    * ```
    */
  get designOutput(): Prisma.DesignOutputDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.roiCalculation`: Exposes CRUD operations for the **RoiCalculation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoiCalculations
    * const roiCalculations = await prisma.roiCalculation.findMany()
    * ```
    */
  get roiCalculation(): Prisma.RoiCalculationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.feedback`: Exposes CRUD operations for the **Feedback** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Feedbacks
    * const feedbacks = await prisma.feedback.findMany()
    * ```
    */
  get feedback(): Prisma.FeedbackDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.2
   * Query Engine version: 1c57fdcd7e44b29b9313256c76699e91c3ac3c43
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Profile: 'Profile',
    Design: 'Design',
    Preferences: 'Preferences',
    DesignOutput: 'DesignOutput',
    RoiCalculation: 'RoiCalculation',
    Feedback: 'Feedback'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "profile" | "design" | "preferences" | "designOutput" | "roiCalculation" | "feedback"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Profile: {
        payload: Prisma.$ProfilePayload<ExtArgs>
        fields: Prisma.ProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findFirst: {
            args: Prisma.ProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findMany: {
            args: Prisma.ProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          create: {
            args: Prisma.ProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          createMany: {
            args: Prisma.ProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          delete: {
            args: Prisma.ProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          update: {
            args: Prisma.ProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          deleteMany: {
            args: Prisma.ProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          upsert: {
            args: Prisma.ProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          aggregate: {
            args: Prisma.ProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfile>
          }
          groupBy: {
            args: Prisma.ProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileCountAggregateOutputType> | number
          }
        }
      }
      Design: {
        payload: Prisma.$DesignPayload<ExtArgs>
        fields: Prisma.DesignFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DesignFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DesignFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignPayload>
          }
          findFirst: {
            args: Prisma.DesignFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DesignFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignPayload>
          }
          findMany: {
            args: Prisma.DesignFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignPayload>[]
          }
          create: {
            args: Prisma.DesignCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignPayload>
          }
          createMany: {
            args: Prisma.DesignCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DesignCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignPayload>[]
          }
          delete: {
            args: Prisma.DesignDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignPayload>
          }
          update: {
            args: Prisma.DesignUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignPayload>
          }
          deleteMany: {
            args: Prisma.DesignDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DesignUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DesignUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignPayload>[]
          }
          upsert: {
            args: Prisma.DesignUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignPayload>
          }
          aggregate: {
            args: Prisma.DesignAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDesign>
          }
          groupBy: {
            args: Prisma.DesignGroupByArgs<ExtArgs>
            result: $Utils.Optional<DesignGroupByOutputType>[]
          }
          count: {
            args: Prisma.DesignCountArgs<ExtArgs>
            result: $Utils.Optional<DesignCountAggregateOutputType> | number
          }
        }
      }
      Preferences: {
        payload: Prisma.$PreferencesPayload<ExtArgs>
        fields: Prisma.PreferencesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PreferencesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreferencesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PreferencesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreferencesPayload>
          }
          findFirst: {
            args: Prisma.PreferencesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreferencesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PreferencesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreferencesPayload>
          }
          findMany: {
            args: Prisma.PreferencesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreferencesPayload>[]
          }
          create: {
            args: Prisma.PreferencesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreferencesPayload>
          }
          createMany: {
            args: Prisma.PreferencesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PreferencesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreferencesPayload>[]
          }
          delete: {
            args: Prisma.PreferencesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreferencesPayload>
          }
          update: {
            args: Prisma.PreferencesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreferencesPayload>
          }
          deleteMany: {
            args: Prisma.PreferencesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PreferencesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PreferencesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreferencesPayload>[]
          }
          upsert: {
            args: Prisma.PreferencesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreferencesPayload>
          }
          aggregate: {
            args: Prisma.PreferencesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePreferences>
          }
          groupBy: {
            args: Prisma.PreferencesGroupByArgs<ExtArgs>
            result: $Utils.Optional<PreferencesGroupByOutputType>[]
          }
          count: {
            args: Prisma.PreferencesCountArgs<ExtArgs>
            result: $Utils.Optional<PreferencesCountAggregateOutputType> | number
          }
        }
      }
      DesignOutput: {
        payload: Prisma.$DesignOutputPayload<ExtArgs>
        fields: Prisma.DesignOutputFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DesignOutputFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignOutputPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DesignOutputFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignOutputPayload>
          }
          findFirst: {
            args: Prisma.DesignOutputFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignOutputPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DesignOutputFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignOutputPayload>
          }
          findMany: {
            args: Prisma.DesignOutputFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignOutputPayload>[]
          }
          create: {
            args: Prisma.DesignOutputCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignOutputPayload>
          }
          createMany: {
            args: Prisma.DesignOutputCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DesignOutputCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignOutputPayload>[]
          }
          delete: {
            args: Prisma.DesignOutputDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignOutputPayload>
          }
          update: {
            args: Prisma.DesignOutputUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignOutputPayload>
          }
          deleteMany: {
            args: Prisma.DesignOutputDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DesignOutputUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DesignOutputUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignOutputPayload>[]
          }
          upsert: {
            args: Prisma.DesignOutputUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignOutputPayload>
          }
          aggregate: {
            args: Prisma.DesignOutputAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDesignOutput>
          }
          groupBy: {
            args: Prisma.DesignOutputGroupByArgs<ExtArgs>
            result: $Utils.Optional<DesignOutputGroupByOutputType>[]
          }
          count: {
            args: Prisma.DesignOutputCountArgs<ExtArgs>
            result: $Utils.Optional<DesignOutputCountAggregateOutputType> | number
          }
        }
      }
      RoiCalculation: {
        payload: Prisma.$RoiCalculationPayload<ExtArgs>
        fields: Prisma.RoiCalculationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoiCalculationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoiCalculationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoiCalculationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoiCalculationPayload>
          }
          findFirst: {
            args: Prisma.RoiCalculationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoiCalculationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoiCalculationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoiCalculationPayload>
          }
          findMany: {
            args: Prisma.RoiCalculationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoiCalculationPayload>[]
          }
          create: {
            args: Prisma.RoiCalculationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoiCalculationPayload>
          }
          createMany: {
            args: Prisma.RoiCalculationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoiCalculationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoiCalculationPayload>[]
          }
          delete: {
            args: Prisma.RoiCalculationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoiCalculationPayload>
          }
          update: {
            args: Prisma.RoiCalculationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoiCalculationPayload>
          }
          deleteMany: {
            args: Prisma.RoiCalculationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoiCalculationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoiCalculationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoiCalculationPayload>[]
          }
          upsert: {
            args: Prisma.RoiCalculationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoiCalculationPayload>
          }
          aggregate: {
            args: Prisma.RoiCalculationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoiCalculation>
          }
          groupBy: {
            args: Prisma.RoiCalculationGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoiCalculationGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoiCalculationCountArgs<ExtArgs>
            result: $Utils.Optional<RoiCalculationCountAggregateOutputType> | number
          }
        }
      }
      Feedback: {
        payload: Prisma.$FeedbackPayload<ExtArgs>
        fields: Prisma.FeedbackFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FeedbackFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FeedbackFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          findFirst: {
            args: Prisma.FeedbackFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FeedbackFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          findMany: {
            args: Prisma.FeedbackFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>[]
          }
          create: {
            args: Prisma.FeedbackCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          createMany: {
            args: Prisma.FeedbackCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FeedbackCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>[]
          }
          delete: {
            args: Prisma.FeedbackDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          update: {
            args: Prisma.FeedbackUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          deleteMany: {
            args: Prisma.FeedbackDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FeedbackUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FeedbackUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>[]
          }
          upsert: {
            args: Prisma.FeedbackUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          aggregate: {
            args: Prisma.FeedbackAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFeedback>
          }
          groupBy: {
            args: Prisma.FeedbackGroupByArgs<ExtArgs>
            result: $Utils.Optional<FeedbackGroupByOutputType>[]
          }
          count: {
            args: Prisma.FeedbackCountArgs<ExtArgs>
            result: $Utils.Optional<FeedbackCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    profile?: ProfileOmit
    design?: DesignOmit
    preferences?: PreferencesOmit
    designOutput?: DesignOutputOmit
    roiCalculation?: RoiCalculationOmit
    feedback?: FeedbackOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProfileCountOutputType
   */

  export type ProfileCountOutputType = {
    designs: number
    feedback: number
  }

  export type ProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    designs?: boolean | ProfileCountOutputTypeCountDesignsArgs
    feedback?: boolean | ProfileCountOutputTypeCountFeedbackArgs
  }

  // Custom InputTypes
  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileCountOutputType
     */
    select?: ProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountDesignsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DesignWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountFeedbackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FeedbackWhereInput
  }


  /**
   * Count Type DesignCountOutputType
   */

  export type DesignCountOutputType = {
    designOutputs: number
    feedback: number
  }

  export type DesignCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    designOutputs?: boolean | DesignCountOutputTypeCountDesignOutputsArgs
    feedback?: boolean | DesignCountOutputTypeCountFeedbackArgs
  }

  // Custom InputTypes
  /**
   * DesignCountOutputType without action
   */
  export type DesignCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DesignCountOutputType
     */
    select?: DesignCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DesignCountOutputType without action
   */
  export type DesignCountOutputTypeCountDesignOutputsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DesignOutputWhereInput
  }

  /**
   * DesignCountOutputType without action
   */
  export type DesignCountOutputTypeCountFeedbackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FeedbackWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Profile
   */

  export type AggregateProfile = {
    _count: ProfileCountAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  export type ProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    company: string | null
    role: $Enums.UserRole | null
    avatar: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    company: string | null
    role: $Enums.UserRole | null
    avatar: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProfileCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    company: number
    role: number
    avatar: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProfileMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    company?: true
    role?: true
    avatar?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    company?: true
    role?: true
    avatar?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProfileCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    company?: true
    role?: true
    avatar?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profile to aggregate.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Profiles
    **/
    _count?: true | ProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfileMaxAggregateInputType
  }

  export type GetProfileAggregateType<T extends ProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfile[P]>
      : GetScalarType<T[P], AggregateProfile[P]>
  }




  export type ProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileWhereInput
    orderBy?: ProfileOrderByWithAggregationInput | ProfileOrderByWithAggregationInput[]
    by: ProfileScalarFieldEnum[] | ProfileScalarFieldEnum
    having?: ProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileCountAggregateInputType | true
    _min?: ProfileMinAggregateInputType
    _max?: ProfileMaxAggregateInputType
  }

  export type ProfileGroupByOutputType = {
    id: string
    userId: string
    name: string | null
    company: string | null
    role: $Enums.UserRole
    avatar: string | null
    createdAt: Date
    updatedAt: Date
    _count: ProfileCountAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  type GetProfileGroupByPayload<T extends ProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileGroupByOutputType[P]>
        }
      >
    >


  export type ProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    company?: boolean
    role?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    designs?: boolean | Profile$designsArgs<ExtArgs>
    feedback?: boolean | Profile$feedbackArgs<ExtArgs>
    _count?: boolean | ProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    company?: boolean
    role?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    company?: boolean
    role?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    company?: boolean
    role?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "name" | "company" | "role" | "avatar" | "createdAt" | "updatedAt", ExtArgs["result"]["profile"]>
  export type ProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    designs?: boolean | Profile$designsArgs<ExtArgs>
    feedback?: boolean | Profile$feedbackArgs<ExtArgs>
    _count?: boolean | ProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Profile"
    objects: {
      designs: Prisma.$DesignPayload<ExtArgs>[]
      feedback: Prisma.$FeedbackPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string | null
      company: string | null
      role: $Enums.UserRole
      avatar: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["profile"]>
    composites: {}
  }

  type ProfileGetPayload<S extends boolean | null | undefined | ProfileDefaultArgs> = $Result.GetResult<Prisma.$ProfilePayload, S>

  type ProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfileCountAggregateInputType | true
    }

  export interface ProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Profile'], meta: { name: 'Profile' } }
    /**
     * Find zero or one Profile that matches the filter.
     * @param {ProfileFindUniqueArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileFindUniqueArgs>(args: SelectSubset<T, ProfileFindUniqueArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Profile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfileFindUniqueOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileFindFirstArgs>(args?: SelectSubset<T, ProfileFindFirstArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profiles
     * const profiles = await prisma.profile.findMany()
     * 
     * // Get first 10 Profiles
     * const profiles = await prisma.profile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profileWithIdOnly = await prisma.profile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfileFindManyArgs>(args?: SelectSubset<T, ProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Profile.
     * @param {ProfileCreateArgs} args - Arguments to create a Profile.
     * @example
     * // Create one Profile
     * const Profile = await prisma.profile.create({
     *   data: {
     *     // ... data to create a Profile
     *   }
     * })
     * 
     */
    create<T extends ProfileCreateArgs>(args: SelectSubset<T, ProfileCreateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Profiles.
     * @param {ProfileCreateManyArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfileCreateManyArgs>(args?: SelectSubset<T, ProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Profiles and returns the data saved in the database.
     * @param {ProfileCreateManyAndReturnArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Profile.
     * @param {ProfileDeleteArgs} args - Arguments to delete one Profile.
     * @example
     * // Delete one Profile
     * const Profile = await prisma.profile.delete({
     *   where: {
     *     // ... filter to delete one Profile
     *   }
     * })
     * 
     */
    delete<T extends ProfileDeleteArgs>(args: SelectSubset<T, ProfileDeleteArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Profile.
     * @param {ProfileUpdateArgs} args - Arguments to update one Profile.
     * @example
     * // Update one Profile
     * const profile = await prisma.profile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfileUpdateArgs>(args: SelectSubset<T, ProfileUpdateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Profiles.
     * @param {ProfileDeleteManyArgs} args - Arguments to filter Profiles to delete.
     * @example
     * // Delete a few Profiles
     * const { count } = await prisma.profile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfileDeleteManyArgs>(args?: SelectSubset<T, ProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfileUpdateManyArgs>(args: SelectSubset<T, ProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles and returns the data updated in the database.
     * @param {ProfileUpdateManyAndReturnArgs} args - Arguments to update many Profiles.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, ProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Profile.
     * @param {ProfileUpsertArgs} args - Arguments to update or create a Profile.
     * @example
     * // Update or create a Profile
     * const profile = await prisma.profile.upsert({
     *   create: {
     *     // ... data to create a Profile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profile we want to update
     *   }
     * })
     */
    upsert<T extends ProfileUpsertArgs>(args: SelectSubset<T, ProfileUpsertArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileCountArgs} args - Arguments to filter Profiles to count.
     * @example
     * // Count the number of Profiles
     * const count = await prisma.profile.count({
     *   where: {
     *     // ... the filter for the Profiles we want to count
     *   }
     * })
    **/
    count<T extends ProfileCountArgs>(
      args?: Subset<T, ProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProfileAggregateArgs>(args: Subset<T, ProfileAggregateArgs>): Prisma.PrismaPromise<GetProfileAggregateType<T>>

    /**
     * Group by Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileGroupByArgs['orderBy'] }
        : { orderBy?: ProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Profile model
   */
  readonly fields: ProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Profile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    designs<T extends Profile$designsArgs<ExtArgs> = {}>(args?: Subset<T, Profile$designsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DesignPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    feedback<T extends Profile$feedbackArgs<ExtArgs> = {}>(args?: Subset<T, Profile$feedbackArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Profile model
   */
  interface ProfileFieldRefs {
    readonly id: FieldRef<"Profile", 'String'>
    readonly userId: FieldRef<"Profile", 'String'>
    readonly name: FieldRef<"Profile", 'String'>
    readonly company: FieldRef<"Profile", 'String'>
    readonly role: FieldRef<"Profile", 'UserRole'>
    readonly avatar: FieldRef<"Profile", 'String'>
    readonly createdAt: FieldRef<"Profile", 'DateTime'>
    readonly updatedAt: FieldRef<"Profile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Profile findUnique
   */
  export type ProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findUniqueOrThrow
   */
  export type ProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findFirst
   */
  export type ProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findFirstOrThrow
   */
  export type ProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findMany
   */
  export type ProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profiles to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile create
   */
  export type ProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a Profile.
     */
    data: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
  }

  /**
   * Profile createMany
   */
  export type ProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile createManyAndReturn
   */
  export type ProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile update
   */
  export type ProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a Profile.
     */
    data: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
    /**
     * Choose, which Profile to update.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile updateMany
   */
  export type ProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
  }

  /**
   * Profile updateManyAndReturn
   */
  export type ProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
  }

  /**
   * Profile upsert
   */
  export type ProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the Profile to update in case it exists.
     */
    where: ProfileWhereUniqueInput
    /**
     * In case the Profile found by the `where` argument doesn't exist, create a new Profile with this data.
     */
    create: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
    /**
     * In case the Profile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
  }

  /**
   * Profile delete
   */
  export type ProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter which Profile to delete.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile deleteMany
   */
  export type ProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profiles to delete
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to delete.
     */
    limit?: number
  }

  /**
   * Profile.designs
   */
  export type Profile$designsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Design
     */
    select?: DesignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Design
     */
    omit?: DesignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignInclude<ExtArgs> | null
    where?: DesignWhereInput
    orderBy?: DesignOrderByWithRelationInput | DesignOrderByWithRelationInput[]
    cursor?: DesignWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DesignScalarFieldEnum | DesignScalarFieldEnum[]
  }

  /**
   * Profile.feedback
   */
  export type Profile$feedbackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    where?: FeedbackWhereInput
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    cursor?: FeedbackWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * Profile without action
   */
  export type ProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
  }


  /**
   * Model Design
   */

  export type AggregateDesign = {
    _count: DesignCountAggregateOutputType | null
    _min: DesignMinAggregateOutputType | null
    _max: DesignMaxAggregateOutputType | null
  }

  export type DesignMinAggregateOutputType = {
    id: string | null
    userId: string | null
    inputPrompt: string | null
    uploadedImageUrl: string | null
    aiModelUsed: string | null
    status: $Enums.DesignStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DesignMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    inputPrompt: string | null
    uploadedImageUrl: string | null
    aiModelUsed: string | null
    status: $Enums.DesignStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DesignCountAggregateOutputType = {
    id: number
    userId: number
    inputPrompt: number
    uploadedImageUrl: number
    aiModelUsed: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DesignMinAggregateInputType = {
    id?: true
    userId?: true
    inputPrompt?: true
    uploadedImageUrl?: true
    aiModelUsed?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DesignMaxAggregateInputType = {
    id?: true
    userId?: true
    inputPrompt?: true
    uploadedImageUrl?: true
    aiModelUsed?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DesignCountAggregateInputType = {
    id?: true
    userId?: true
    inputPrompt?: true
    uploadedImageUrl?: true
    aiModelUsed?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DesignAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Design to aggregate.
     */
    where?: DesignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Designs to fetch.
     */
    orderBy?: DesignOrderByWithRelationInput | DesignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DesignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Designs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Designs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Designs
    **/
    _count?: true | DesignCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DesignMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DesignMaxAggregateInputType
  }

  export type GetDesignAggregateType<T extends DesignAggregateArgs> = {
        [P in keyof T & keyof AggregateDesign]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDesign[P]>
      : GetScalarType<T[P], AggregateDesign[P]>
  }




  export type DesignGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DesignWhereInput
    orderBy?: DesignOrderByWithAggregationInput | DesignOrderByWithAggregationInput[]
    by: DesignScalarFieldEnum[] | DesignScalarFieldEnum
    having?: DesignScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DesignCountAggregateInputType | true
    _min?: DesignMinAggregateInputType
    _max?: DesignMaxAggregateInputType
  }

  export type DesignGroupByOutputType = {
    id: string
    userId: string
    inputPrompt: string
    uploadedImageUrl: string | null
    aiModelUsed: string
    status: $Enums.DesignStatus
    createdAt: Date
    updatedAt: Date
    _count: DesignCountAggregateOutputType | null
    _min: DesignMinAggregateOutputType | null
    _max: DesignMaxAggregateOutputType | null
  }

  type GetDesignGroupByPayload<T extends DesignGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DesignGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DesignGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DesignGroupByOutputType[P]>
            : GetScalarType<T[P], DesignGroupByOutputType[P]>
        }
      >
    >


  export type DesignSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    inputPrompt?: boolean
    uploadedImageUrl?: boolean
    aiModelUsed?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    designOutputs?: boolean | Design$designOutputsArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    feedback?: boolean | Design$feedbackArgs<ExtArgs>
    preferences?: boolean | Design$preferencesArgs<ExtArgs>
    roiCalculation?: boolean | Design$roiCalculationArgs<ExtArgs>
    _count?: boolean | DesignCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["design"]>

  export type DesignSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    inputPrompt?: boolean
    uploadedImageUrl?: boolean
    aiModelUsed?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["design"]>

  export type DesignSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    inputPrompt?: boolean
    uploadedImageUrl?: boolean
    aiModelUsed?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["design"]>

  export type DesignSelectScalar = {
    id?: boolean
    userId?: boolean
    inputPrompt?: boolean
    uploadedImageUrl?: boolean
    aiModelUsed?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DesignOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "inputPrompt" | "uploadedImageUrl" | "aiModelUsed" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["design"]>
  export type DesignInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    designOutputs?: boolean | Design$designOutputsArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    feedback?: boolean | Design$feedbackArgs<ExtArgs>
    preferences?: boolean | Design$preferencesArgs<ExtArgs>
    roiCalculation?: boolean | Design$roiCalculationArgs<ExtArgs>
    _count?: boolean | DesignCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DesignIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type DesignIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $DesignPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Design"
    objects: {
      designOutputs: Prisma.$DesignOutputPayload<ExtArgs>[]
      profile: Prisma.$ProfilePayload<ExtArgs>
      feedback: Prisma.$FeedbackPayload<ExtArgs>[]
      preferences: Prisma.$PreferencesPayload<ExtArgs> | null
      roiCalculation: Prisma.$RoiCalculationPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      inputPrompt: string
      uploadedImageUrl: string | null
      aiModelUsed: string
      status: $Enums.DesignStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["design"]>
    composites: {}
  }

  type DesignGetPayload<S extends boolean | null | undefined | DesignDefaultArgs> = $Result.GetResult<Prisma.$DesignPayload, S>

  type DesignCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DesignFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DesignCountAggregateInputType | true
    }

  export interface DesignDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Design'], meta: { name: 'Design' } }
    /**
     * Find zero or one Design that matches the filter.
     * @param {DesignFindUniqueArgs} args - Arguments to find a Design
     * @example
     * // Get one Design
     * const design = await prisma.design.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DesignFindUniqueArgs>(args: SelectSubset<T, DesignFindUniqueArgs<ExtArgs>>): Prisma__DesignClient<$Result.GetResult<Prisma.$DesignPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Design that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DesignFindUniqueOrThrowArgs} args - Arguments to find a Design
     * @example
     * // Get one Design
     * const design = await prisma.design.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DesignFindUniqueOrThrowArgs>(args: SelectSubset<T, DesignFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DesignClient<$Result.GetResult<Prisma.$DesignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Design that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignFindFirstArgs} args - Arguments to find a Design
     * @example
     * // Get one Design
     * const design = await prisma.design.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DesignFindFirstArgs>(args?: SelectSubset<T, DesignFindFirstArgs<ExtArgs>>): Prisma__DesignClient<$Result.GetResult<Prisma.$DesignPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Design that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignFindFirstOrThrowArgs} args - Arguments to find a Design
     * @example
     * // Get one Design
     * const design = await prisma.design.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DesignFindFirstOrThrowArgs>(args?: SelectSubset<T, DesignFindFirstOrThrowArgs<ExtArgs>>): Prisma__DesignClient<$Result.GetResult<Prisma.$DesignPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Designs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Designs
     * const designs = await prisma.design.findMany()
     * 
     * // Get first 10 Designs
     * const designs = await prisma.design.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const designWithIdOnly = await prisma.design.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DesignFindManyArgs>(args?: SelectSubset<T, DesignFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DesignPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Design.
     * @param {DesignCreateArgs} args - Arguments to create a Design.
     * @example
     * // Create one Design
     * const Design = await prisma.design.create({
     *   data: {
     *     // ... data to create a Design
     *   }
     * })
     * 
     */
    create<T extends DesignCreateArgs>(args: SelectSubset<T, DesignCreateArgs<ExtArgs>>): Prisma__DesignClient<$Result.GetResult<Prisma.$DesignPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Designs.
     * @param {DesignCreateManyArgs} args - Arguments to create many Designs.
     * @example
     * // Create many Designs
     * const design = await prisma.design.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DesignCreateManyArgs>(args?: SelectSubset<T, DesignCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Designs and returns the data saved in the database.
     * @param {DesignCreateManyAndReturnArgs} args - Arguments to create many Designs.
     * @example
     * // Create many Designs
     * const design = await prisma.design.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Designs and only return the `id`
     * const designWithIdOnly = await prisma.design.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DesignCreateManyAndReturnArgs>(args?: SelectSubset<T, DesignCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DesignPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Design.
     * @param {DesignDeleteArgs} args - Arguments to delete one Design.
     * @example
     * // Delete one Design
     * const Design = await prisma.design.delete({
     *   where: {
     *     // ... filter to delete one Design
     *   }
     * })
     * 
     */
    delete<T extends DesignDeleteArgs>(args: SelectSubset<T, DesignDeleteArgs<ExtArgs>>): Prisma__DesignClient<$Result.GetResult<Prisma.$DesignPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Design.
     * @param {DesignUpdateArgs} args - Arguments to update one Design.
     * @example
     * // Update one Design
     * const design = await prisma.design.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DesignUpdateArgs>(args: SelectSubset<T, DesignUpdateArgs<ExtArgs>>): Prisma__DesignClient<$Result.GetResult<Prisma.$DesignPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Designs.
     * @param {DesignDeleteManyArgs} args - Arguments to filter Designs to delete.
     * @example
     * // Delete a few Designs
     * const { count } = await prisma.design.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DesignDeleteManyArgs>(args?: SelectSubset<T, DesignDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Designs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Designs
     * const design = await prisma.design.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DesignUpdateManyArgs>(args: SelectSubset<T, DesignUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Designs and returns the data updated in the database.
     * @param {DesignUpdateManyAndReturnArgs} args - Arguments to update many Designs.
     * @example
     * // Update many Designs
     * const design = await prisma.design.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Designs and only return the `id`
     * const designWithIdOnly = await prisma.design.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DesignUpdateManyAndReturnArgs>(args: SelectSubset<T, DesignUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DesignPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Design.
     * @param {DesignUpsertArgs} args - Arguments to update or create a Design.
     * @example
     * // Update or create a Design
     * const design = await prisma.design.upsert({
     *   create: {
     *     // ... data to create a Design
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Design we want to update
     *   }
     * })
     */
    upsert<T extends DesignUpsertArgs>(args: SelectSubset<T, DesignUpsertArgs<ExtArgs>>): Prisma__DesignClient<$Result.GetResult<Prisma.$DesignPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Designs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignCountArgs} args - Arguments to filter Designs to count.
     * @example
     * // Count the number of Designs
     * const count = await prisma.design.count({
     *   where: {
     *     // ... the filter for the Designs we want to count
     *   }
     * })
    **/
    count<T extends DesignCountArgs>(
      args?: Subset<T, DesignCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DesignCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Design.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DesignAggregateArgs>(args: Subset<T, DesignAggregateArgs>): Prisma.PrismaPromise<GetDesignAggregateType<T>>

    /**
     * Group by Design.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DesignGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DesignGroupByArgs['orderBy'] }
        : { orderBy?: DesignGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DesignGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDesignGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Design model
   */
  readonly fields: DesignFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Design.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DesignClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    designOutputs<T extends Design$designOutputsArgs<ExtArgs> = {}>(args?: Subset<T, Design$designOutputsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DesignOutputPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    feedback<T extends Design$feedbackArgs<ExtArgs> = {}>(args?: Subset<T, Design$feedbackArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    preferences<T extends Design$preferencesArgs<ExtArgs> = {}>(args?: Subset<T, Design$preferencesArgs<ExtArgs>>): Prisma__PreferencesClient<$Result.GetResult<Prisma.$PreferencesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    roiCalculation<T extends Design$roiCalculationArgs<ExtArgs> = {}>(args?: Subset<T, Design$roiCalculationArgs<ExtArgs>>): Prisma__RoiCalculationClient<$Result.GetResult<Prisma.$RoiCalculationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Design model
   */
  interface DesignFieldRefs {
    readonly id: FieldRef<"Design", 'String'>
    readonly userId: FieldRef<"Design", 'String'>
    readonly inputPrompt: FieldRef<"Design", 'String'>
    readonly uploadedImageUrl: FieldRef<"Design", 'String'>
    readonly aiModelUsed: FieldRef<"Design", 'String'>
    readonly status: FieldRef<"Design", 'DesignStatus'>
    readonly createdAt: FieldRef<"Design", 'DateTime'>
    readonly updatedAt: FieldRef<"Design", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Design findUnique
   */
  export type DesignFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Design
     */
    select?: DesignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Design
     */
    omit?: DesignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignInclude<ExtArgs> | null
    /**
     * Filter, which Design to fetch.
     */
    where: DesignWhereUniqueInput
  }

  /**
   * Design findUniqueOrThrow
   */
  export type DesignFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Design
     */
    select?: DesignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Design
     */
    omit?: DesignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignInclude<ExtArgs> | null
    /**
     * Filter, which Design to fetch.
     */
    where: DesignWhereUniqueInput
  }

  /**
   * Design findFirst
   */
  export type DesignFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Design
     */
    select?: DesignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Design
     */
    omit?: DesignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignInclude<ExtArgs> | null
    /**
     * Filter, which Design to fetch.
     */
    where?: DesignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Designs to fetch.
     */
    orderBy?: DesignOrderByWithRelationInput | DesignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Designs.
     */
    cursor?: DesignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Designs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Designs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Designs.
     */
    distinct?: DesignScalarFieldEnum | DesignScalarFieldEnum[]
  }

  /**
   * Design findFirstOrThrow
   */
  export type DesignFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Design
     */
    select?: DesignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Design
     */
    omit?: DesignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignInclude<ExtArgs> | null
    /**
     * Filter, which Design to fetch.
     */
    where?: DesignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Designs to fetch.
     */
    orderBy?: DesignOrderByWithRelationInput | DesignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Designs.
     */
    cursor?: DesignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Designs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Designs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Designs.
     */
    distinct?: DesignScalarFieldEnum | DesignScalarFieldEnum[]
  }

  /**
   * Design findMany
   */
  export type DesignFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Design
     */
    select?: DesignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Design
     */
    omit?: DesignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignInclude<ExtArgs> | null
    /**
     * Filter, which Designs to fetch.
     */
    where?: DesignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Designs to fetch.
     */
    orderBy?: DesignOrderByWithRelationInput | DesignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Designs.
     */
    cursor?: DesignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Designs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Designs.
     */
    skip?: number
    distinct?: DesignScalarFieldEnum | DesignScalarFieldEnum[]
  }

  /**
   * Design create
   */
  export type DesignCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Design
     */
    select?: DesignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Design
     */
    omit?: DesignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignInclude<ExtArgs> | null
    /**
     * The data needed to create a Design.
     */
    data: XOR<DesignCreateInput, DesignUncheckedCreateInput>
  }

  /**
   * Design createMany
   */
  export type DesignCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Designs.
     */
    data: DesignCreateManyInput | DesignCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Design createManyAndReturn
   */
  export type DesignCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Design
     */
    select?: DesignSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Design
     */
    omit?: DesignOmit<ExtArgs> | null
    /**
     * The data used to create many Designs.
     */
    data: DesignCreateManyInput | DesignCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Design update
   */
  export type DesignUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Design
     */
    select?: DesignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Design
     */
    omit?: DesignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignInclude<ExtArgs> | null
    /**
     * The data needed to update a Design.
     */
    data: XOR<DesignUpdateInput, DesignUncheckedUpdateInput>
    /**
     * Choose, which Design to update.
     */
    where: DesignWhereUniqueInput
  }

  /**
   * Design updateMany
   */
  export type DesignUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Designs.
     */
    data: XOR<DesignUpdateManyMutationInput, DesignUncheckedUpdateManyInput>
    /**
     * Filter which Designs to update
     */
    where?: DesignWhereInput
    /**
     * Limit how many Designs to update.
     */
    limit?: number
  }

  /**
   * Design updateManyAndReturn
   */
  export type DesignUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Design
     */
    select?: DesignSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Design
     */
    omit?: DesignOmit<ExtArgs> | null
    /**
     * The data used to update Designs.
     */
    data: XOR<DesignUpdateManyMutationInput, DesignUncheckedUpdateManyInput>
    /**
     * Filter which Designs to update
     */
    where?: DesignWhereInput
    /**
     * Limit how many Designs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Design upsert
   */
  export type DesignUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Design
     */
    select?: DesignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Design
     */
    omit?: DesignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignInclude<ExtArgs> | null
    /**
     * The filter to search for the Design to update in case it exists.
     */
    where: DesignWhereUniqueInput
    /**
     * In case the Design found by the `where` argument doesn't exist, create a new Design with this data.
     */
    create: XOR<DesignCreateInput, DesignUncheckedCreateInput>
    /**
     * In case the Design was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DesignUpdateInput, DesignUncheckedUpdateInput>
  }

  /**
   * Design delete
   */
  export type DesignDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Design
     */
    select?: DesignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Design
     */
    omit?: DesignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignInclude<ExtArgs> | null
    /**
     * Filter which Design to delete.
     */
    where: DesignWhereUniqueInput
  }

  /**
   * Design deleteMany
   */
  export type DesignDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Designs to delete
     */
    where?: DesignWhereInput
    /**
     * Limit how many Designs to delete.
     */
    limit?: number
  }

  /**
   * Design.designOutputs
   */
  export type Design$designOutputsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DesignOutput
     */
    select?: DesignOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DesignOutput
     */
    omit?: DesignOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignOutputInclude<ExtArgs> | null
    where?: DesignOutputWhereInput
    orderBy?: DesignOutputOrderByWithRelationInput | DesignOutputOrderByWithRelationInput[]
    cursor?: DesignOutputWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DesignOutputScalarFieldEnum | DesignOutputScalarFieldEnum[]
  }

  /**
   * Design.feedback
   */
  export type Design$feedbackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    where?: FeedbackWhereInput
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    cursor?: FeedbackWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * Design.preferences
   */
  export type Design$preferencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Preferences
     */
    select?: PreferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Preferences
     */
    omit?: PreferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreferencesInclude<ExtArgs> | null
    where?: PreferencesWhereInput
  }

  /**
   * Design.roiCalculation
   */
  export type Design$roiCalculationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoiCalculation
     */
    select?: RoiCalculationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoiCalculation
     */
    omit?: RoiCalculationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoiCalculationInclude<ExtArgs> | null
    where?: RoiCalculationWhereInput
  }

  /**
   * Design without action
   */
  export type DesignDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Design
     */
    select?: DesignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Design
     */
    omit?: DesignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignInclude<ExtArgs> | null
  }


  /**
   * Model Preferences
   */

  export type AggregatePreferences = {
    _count: PreferencesCountAggregateOutputType | null
    _avg: PreferencesAvgAggregateOutputType | null
    _sum: PreferencesSumAggregateOutputType | null
    _min: PreferencesMinAggregateOutputType | null
    _max: PreferencesMaxAggregateOutputType | null
  }

  export type PreferencesAvgAggregateOutputType = {
    budget: number | null
  }

  export type PreferencesSumAggregateOutputType = {
    budget: number | null
  }

  export type PreferencesMinAggregateOutputType = {
    id: string | null
    designId: string | null
    roomType: string | null
    size: string | null
    stylePreference: string | null
    budget: number | null
    colorScheme: string | null
    materialPreferences: string | null
    otherRequirements: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PreferencesMaxAggregateOutputType = {
    id: string | null
    designId: string | null
    roomType: string | null
    size: string | null
    stylePreference: string | null
    budget: number | null
    colorScheme: string | null
    materialPreferences: string | null
    otherRequirements: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PreferencesCountAggregateOutputType = {
    id: number
    designId: number
    roomType: number
    size: number
    stylePreference: number
    budget: number
    colorScheme: number
    materialPreferences: number
    otherRequirements: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PreferencesAvgAggregateInputType = {
    budget?: true
  }

  export type PreferencesSumAggregateInputType = {
    budget?: true
  }

  export type PreferencesMinAggregateInputType = {
    id?: true
    designId?: true
    roomType?: true
    size?: true
    stylePreference?: true
    budget?: true
    colorScheme?: true
    materialPreferences?: true
    otherRequirements?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PreferencesMaxAggregateInputType = {
    id?: true
    designId?: true
    roomType?: true
    size?: true
    stylePreference?: true
    budget?: true
    colorScheme?: true
    materialPreferences?: true
    otherRequirements?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PreferencesCountAggregateInputType = {
    id?: true
    designId?: true
    roomType?: true
    size?: true
    stylePreference?: true
    budget?: true
    colorScheme?: true
    materialPreferences?: true
    otherRequirements?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PreferencesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Preferences to aggregate.
     */
    where?: PreferencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Preferences to fetch.
     */
    orderBy?: PreferencesOrderByWithRelationInput | PreferencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PreferencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Preferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Preferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Preferences
    **/
    _count?: true | PreferencesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PreferencesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PreferencesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PreferencesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PreferencesMaxAggregateInputType
  }

  export type GetPreferencesAggregateType<T extends PreferencesAggregateArgs> = {
        [P in keyof T & keyof AggregatePreferences]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePreferences[P]>
      : GetScalarType<T[P], AggregatePreferences[P]>
  }




  export type PreferencesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PreferencesWhereInput
    orderBy?: PreferencesOrderByWithAggregationInput | PreferencesOrderByWithAggregationInput[]
    by: PreferencesScalarFieldEnum[] | PreferencesScalarFieldEnum
    having?: PreferencesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PreferencesCountAggregateInputType | true
    _avg?: PreferencesAvgAggregateInputType
    _sum?: PreferencesSumAggregateInputType
    _min?: PreferencesMinAggregateInputType
    _max?: PreferencesMaxAggregateInputType
  }

  export type PreferencesGroupByOutputType = {
    id: string
    designId: string
    roomType: string
    size: string
    stylePreference: string
    budget: number | null
    colorScheme: string | null
    materialPreferences: string | null
    otherRequirements: string | null
    createdAt: Date
    updatedAt: Date
    _count: PreferencesCountAggregateOutputType | null
    _avg: PreferencesAvgAggregateOutputType | null
    _sum: PreferencesSumAggregateOutputType | null
    _min: PreferencesMinAggregateOutputType | null
    _max: PreferencesMaxAggregateOutputType | null
  }

  type GetPreferencesGroupByPayload<T extends PreferencesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PreferencesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PreferencesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PreferencesGroupByOutputType[P]>
            : GetScalarType<T[P], PreferencesGroupByOutputType[P]>
        }
      >
    >


  export type PreferencesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    roomType?: boolean
    size?: boolean
    stylePreference?: boolean
    budget?: boolean
    colorScheme?: boolean
    materialPreferences?: boolean
    otherRequirements?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    design?: boolean | DesignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["preferences"]>

  export type PreferencesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    roomType?: boolean
    size?: boolean
    stylePreference?: boolean
    budget?: boolean
    colorScheme?: boolean
    materialPreferences?: boolean
    otherRequirements?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    design?: boolean | DesignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["preferences"]>

  export type PreferencesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    roomType?: boolean
    size?: boolean
    stylePreference?: boolean
    budget?: boolean
    colorScheme?: boolean
    materialPreferences?: boolean
    otherRequirements?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    design?: boolean | DesignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["preferences"]>

  export type PreferencesSelectScalar = {
    id?: boolean
    designId?: boolean
    roomType?: boolean
    size?: boolean
    stylePreference?: boolean
    budget?: boolean
    colorScheme?: boolean
    materialPreferences?: boolean
    otherRequirements?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PreferencesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "designId" | "roomType" | "size" | "stylePreference" | "budget" | "colorScheme" | "materialPreferences" | "otherRequirements" | "createdAt" | "updatedAt", ExtArgs["result"]["preferences"]>
  export type PreferencesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | DesignDefaultArgs<ExtArgs>
  }
  export type PreferencesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | DesignDefaultArgs<ExtArgs>
  }
  export type PreferencesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | DesignDefaultArgs<ExtArgs>
  }

  export type $PreferencesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Preferences"
    objects: {
      design: Prisma.$DesignPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      designId: string
      roomType: string
      size: string
      stylePreference: string
      budget: number | null
      colorScheme: string | null
      materialPreferences: string | null
      otherRequirements: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["preferences"]>
    composites: {}
  }

  type PreferencesGetPayload<S extends boolean | null | undefined | PreferencesDefaultArgs> = $Result.GetResult<Prisma.$PreferencesPayload, S>

  type PreferencesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PreferencesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PreferencesCountAggregateInputType | true
    }

  export interface PreferencesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Preferences'], meta: { name: 'Preferences' } }
    /**
     * Find zero or one Preferences that matches the filter.
     * @param {PreferencesFindUniqueArgs} args - Arguments to find a Preferences
     * @example
     * // Get one Preferences
     * const preferences = await prisma.preferences.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PreferencesFindUniqueArgs>(args: SelectSubset<T, PreferencesFindUniqueArgs<ExtArgs>>): Prisma__PreferencesClient<$Result.GetResult<Prisma.$PreferencesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Preferences that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PreferencesFindUniqueOrThrowArgs} args - Arguments to find a Preferences
     * @example
     * // Get one Preferences
     * const preferences = await prisma.preferences.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PreferencesFindUniqueOrThrowArgs>(args: SelectSubset<T, PreferencesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PreferencesClient<$Result.GetResult<Prisma.$PreferencesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Preferences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreferencesFindFirstArgs} args - Arguments to find a Preferences
     * @example
     * // Get one Preferences
     * const preferences = await prisma.preferences.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PreferencesFindFirstArgs>(args?: SelectSubset<T, PreferencesFindFirstArgs<ExtArgs>>): Prisma__PreferencesClient<$Result.GetResult<Prisma.$PreferencesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Preferences that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreferencesFindFirstOrThrowArgs} args - Arguments to find a Preferences
     * @example
     * // Get one Preferences
     * const preferences = await prisma.preferences.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PreferencesFindFirstOrThrowArgs>(args?: SelectSubset<T, PreferencesFindFirstOrThrowArgs<ExtArgs>>): Prisma__PreferencesClient<$Result.GetResult<Prisma.$PreferencesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Preferences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreferencesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Preferences
     * const preferences = await prisma.preferences.findMany()
     * 
     * // Get first 10 Preferences
     * const preferences = await prisma.preferences.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const preferencesWithIdOnly = await prisma.preferences.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PreferencesFindManyArgs>(args?: SelectSubset<T, PreferencesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PreferencesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Preferences.
     * @param {PreferencesCreateArgs} args - Arguments to create a Preferences.
     * @example
     * // Create one Preferences
     * const Preferences = await prisma.preferences.create({
     *   data: {
     *     // ... data to create a Preferences
     *   }
     * })
     * 
     */
    create<T extends PreferencesCreateArgs>(args: SelectSubset<T, PreferencesCreateArgs<ExtArgs>>): Prisma__PreferencesClient<$Result.GetResult<Prisma.$PreferencesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Preferences.
     * @param {PreferencesCreateManyArgs} args - Arguments to create many Preferences.
     * @example
     * // Create many Preferences
     * const preferences = await prisma.preferences.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PreferencesCreateManyArgs>(args?: SelectSubset<T, PreferencesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Preferences and returns the data saved in the database.
     * @param {PreferencesCreateManyAndReturnArgs} args - Arguments to create many Preferences.
     * @example
     * // Create many Preferences
     * const preferences = await prisma.preferences.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Preferences and only return the `id`
     * const preferencesWithIdOnly = await prisma.preferences.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PreferencesCreateManyAndReturnArgs>(args?: SelectSubset<T, PreferencesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PreferencesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Preferences.
     * @param {PreferencesDeleteArgs} args - Arguments to delete one Preferences.
     * @example
     * // Delete one Preferences
     * const Preferences = await prisma.preferences.delete({
     *   where: {
     *     // ... filter to delete one Preferences
     *   }
     * })
     * 
     */
    delete<T extends PreferencesDeleteArgs>(args: SelectSubset<T, PreferencesDeleteArgs<ExtArgs>>): Prisma__PreferencesClient<$Result.GetResult<Prisma.$PreferencesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Preferences.
     * @param {PreferencesUpdateArgs} args - Arguments to update one Preferences.
     * @example
     * // Update one Preferences
     * const preferences = await prisma.preferences.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PreferencesUpdateArgs>(args: SelectSubset<T, PreferencesUpdateArgs<ExtArgs>>): Prisma__PreferencesClient<$Result.GetResult<Prisma.$PreferencesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Preferences.
     * @param {PreferencesDeleteManyArgs} args - Arguments to filter Preferences to delete.
     * @example
     * // Delete a few Preferences
     * const { count } = await prisma.preferences.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PreferencesDeleteManyArgs>(args?: SelectSubset<T, PreferencesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Preferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreferencesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Preferences
     * const preferences = await prisma.preferences.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PreferencesUpdateManyArgs>(args: SelectSubset<T, PreferencesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Preferences and returns the data updated in the database.
     * @param {PreferencesUpdateManyAndReturnArgs} args - Arguments to update many Preferences.
     * @example
     * // Update many Preferences
     * const preferences = await prisma.preferences.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Preferences and only return the `id`
     * const preferencesWithIdOnly = await prisma.preferences.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PreferencesUpdateManyAndReturnArgs>(args: SelectSubset<T, PreferencesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PreferencesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Preferences.
     * @param {PreferencesUpsertArgs} args - Arguments to update or create a Preferences.
     * @example
     * // Update or create a Preferences
     * const preferences = await prisma.preferences.upsert({
     *   create: {
     *     // ... data to create a Preferences
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Preferences we want to update
     *   }
     * })
     */
    upsert<T extends PreferencesUpsertArgs>(args: SelectSubset<T, PreferencesUpsertArgs<ExtArgs>>): Prisma__PreferencesClient<$Result.GetResult<Prisma.$PreferencesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Preferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreferencesCountArgs} args - Arguments to filter Preferences to count.
     * @example
     * // Count the number of Preferences
     * const count = await prisma.preferences.count({
     *   where: {
     *     // ... the filter for the Preferences we want to count
     *   }
     * })
    **/
    count<T extends PreferencesCountArgs>(
      args?: Subset<T, PreferencesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PreferencesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Preferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreferencesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PreferencesAggregateArgs>(args: Subset<T, PreferencesAggregateArgs>): Prisma.PrismaPromise<GetPreferencesAggregateType<T>>

    /**
     * Group by Preferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreferencesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PreferencesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PreferencesGroupByArgs['orderBy'] }
        : { orderBy?: PreferencesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PreferencesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPreferencesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Preferences model
   */
  readonly fields: PreferencesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Preferences.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PreferencesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    design<T extends DesignDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DesignDefaultArgs<ExtArgs>>): Prisma__DesignClient<$Result.GetResult<Prisma.$DesignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Preferences model
   */
  interface PreferencesFieldRefs {
    readonly id: FieldRef<"Preferences", 'String'>
    readonly designId: FieldRef<"Preferences", 'String'>
    readonly roomType: FieldRef<"Preferences", 'String'>
    readonly size: FieldRef<"Preferences", 'String'>
    readonly stylePreference: FieldRef<"Preferences", 'String'>
    readonly budget: FieldRef<"Preferences", 'Float'>
    readonly colorScheme: FieldRef<"Preferences", 'String'>
    readonly materialPreferences: FieldRef<"Preferences", 'String'>
    readonly otherRequirements: FieldRef<"Preferences", 'String'>
    readonly createdAt: FieldRef<"Preferences", 'DateTime'>
    readonly updatedAt: FieldRef<"Preferences", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Preferences findUnique
   */
  export type PreferencesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Preferences
     */
    select?: PreferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Preferences
     */
    omit?: PreferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreferencesInclude<ExtArgs> | null
    /**
     * Filter, which Preferences to fetch.
     */
    where: PreferencesWhereUniqueInput
  }

  /**
   * Preferences findUniqueOrThrow
   */
  export type PreferencesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Preferences
     */
    select?: PreferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Preferences
     */
    omit?: PreferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreferencesInclude<ExtArgs> | null
    /**
     * Filter, which Preferences to fetch.
     */
    where: PreferencesWhereUniqueInput
  }

  /**
   * Preferences findFirst
   */
  export type PreferencesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Preferences
     */
    select?: PreferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Preferences
     */
    omit?: PreferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreferencesInclude<ExtArgs> | null
    /**
     * Filter, which Preferences to fetch.
     */
    where?: PreferencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Preferences to fetch.
     */
    orderBy?: PreferencesOrderByWithRelationInput | PreferencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Preferences.
     */
    cursor?: PreferencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Preferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Preferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Preferences.
     */
    distinct?: PreferencesScalarFieldEnum | PreferencesScalarFieldEnum[]
  }

  /**
   * Preferences findFirstOrThrow
   */
  export type PreferencesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Preferences
     */
    select?: PreferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Preferences
     */
    omit?: PreferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreferencesInclude<ExtArgs> | null
    /**
     * Filter, which Preferences to fetch.
     */
    where?: PreferencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Preferences to fetch.
     */
    orderBy?: PreferencesOrderByWithRelationInput | PreferencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Preferences.
     */
    cursor?: PreferencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Preferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Preferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Preferences.
     */
    distinct?: PreferencesScalarFieldEnum | PreferencesScalarFieldEnum[]
  }

  /**
   * Preferences findMany
   */
  export type PreferencesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Preferences
     */
    select?: PreferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Preferences
     */
    omit?: PreferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreferencesInclude<ExtArgs> | null
    /**
     * Filter, which Preferences to fetch.
     */
    where?: PreferencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Preferences to fetch.
     */
    orderBy?: PreferencesOrderByWithRelationInput | PreferencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Preferences.
     */
    cursor?: PreferencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Preferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Preferences.
     */
    skip?: number
    distinct?: PreferencesScalarFieldEnum | PreferencesScalarFieldEnum[]
  }

  /**
   * Preferences create
   */
  export type PreferencesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Preferences
     */
    select?: PreferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Preferences
     */
    omit?: PreferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreferencesInclude<ExtArgs> | null
    /**
     * The data needed to create a Preferences.
     */
    data: XOR<PreferencesCreateInput, PreferencesUncheckedCreateInput>
  }

  /**
   * Preferences createMany
   */
  export type PreferencesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Preferences.
     */
    data: PreferencesCreateManyInput | PreferencesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Preferences createManyAndReturn
   */
  export type PreferencesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Preferences
     */
    select?: PreferencesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Preferences
     */
    omit?: PreferencesOmit<ExtArgs> | null
    /**
     * The data used to create many Preferences.
     */
    data: PreferencesCreateManyInput | PreferencesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreferencesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Preferences update
   */
  export type PreferencesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Preferences
     */
    select?: PreferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Preferences
     */
    omit?: PreferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreferencesInclude<ExtArgs> | null
    /**
     * The data needed to update a Preferences.
     */
    data: XOR<PreferencesUpdateInput, PreferencesUncheckedUpdateInput>
    /**
     * Choose, which Preferences to update.
     */
    where: PreferencesWhereUniqueInput
  }

  /**
   * Preferences updateMany
   */
  export type PreferencesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Preferences.
     */
    data: XOR<PreferencesUpdateManyMutationInput, PreferencesUncheckedUpdateManyInput>
    /**
     * Filter which Preferences to update
     */
    where?: PreferencesWhereInput
    /**
     * Limit how many Preferences to update.
     */
    limit?: number
  }

  /**
   * Preferences updateManyAndReturn
   */
  export type PreferencesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Preferences
     */
    select?: PreferencesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Preferences
     */
    omit?: PreferencesOmit<ExtArgs> | null
    /**
     * The data used to update Preferences.
     */
    data: XOR<PreferencesUpdateManyMutationInput, PreferencesUncheckedUpdateManyInput>
    /**
     * Filter which Preferences to update
     */
    where?: PreferencesWhereInput
    /**
     * Limit how many Preferences to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreferencesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Preferences upsert
   */
  export type PreferencesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Preferences
     */
    select?: PreferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Preferences
     */
    omit?: PreferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreferencesInclude<ExtArgs> | null
    /**
     * The filter to search for the Preferences to update in case it exists.
     */
    where: PreferencesWhereUniqueInput
    /**
     * In case the Preferences found by the `where` argument doesn't exist, create a new Preferences with this data.
     */
    create: XOR<PreferencesCreateInput, PreferencesUncheckedCreateInput>
    /**
     * In case the Preferences was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PreferencesUpdateInput, PreferencesUncheckedUpdateInput>
  }

  /**
   * Preferences delete
   */
  export type PreferencesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Preferences
     */
    select?: PreferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Preferences
     */
    omit?: PreferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreferencesInclude<ExtArgs> | null
    /**
     * Filter which Preferences to delete.
     */
    where: PreferencesWhereUniqueInput
  }

  /**
   * Preferences deleteMany
   */
  export type PreferencesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Preferences to delete
     */
    where?: PreferencesWhereInput
    /**
     * Limit how many Preferences to delete.
     */
    limit?: number
  }

  /**
   * Preferences without action
   */
  export type PreferencesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Preferences
     */
    select?: PreferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Preferences
     */
    omit?: PreferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreferencesInclude<ExtArgs> | null
  }


  /**
   * Model DesignOutput
   */

  export type AggregateDesignOutput = {
    _count: DesignOutputCountAggregateOutputType | null
    _min: DesignOutputMinAggregateOutputType | null
    _max: DesignOutputMaxAggregateOutputType | null
  }

  export type DesignOutputMinAggregateOutputType = {
    id: string | null
    designId: string | null
    outputImageUrl: string | null
    variationName: string | null
    createdAt: Date | null
  }

  export type DesignOutputMaxAggregateOutputType = {
    id: string | null
    designId: string | null
    outputImageUrl: string | null
    variationName: string | null
    createdAt: Date | null
  }

  export type DesignOutputCountAggregateOutputType = {
    id: number
    designId: number
    outputImageUrl: number
    variationName: number
    generationParameters: number
    createdAt: number
    _all: number
  }


  export type DesignOutputMinAggregateInputType = {
    id?: true
    designId?: true
    outputImageUrl?: true
    variationName?: true
    createdAt?: true
  }

  export type DesignOutputMaxAggregateInputType = {
    id?: true
    designId?: true
    outputImageUrl?: true
    variationName?: true
    createdAt?: true
  }

  export type DesignOutputCountAggregateInputType = {
    id?: true
    designId?: true
    outputImageUrl?: true
    variationName?: true
    generationParameters?: true
    createdAt?: true
    _all?: true
  }

  export type DesignOutputAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DesignOutput to aggregate.
     */
    where?: DesignOutputWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DesignOutputs to fetch.
     */
    orderBy?: DesignOutputOrderByWithRelationInput | DesignOutputOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DesignOutputWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DesignOutputs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DesignOutputs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DesignOutputs
    **/
    _count?: true | DesignOutputCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DesignOutputMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DesignOutputMaxAggregateInputType
  }

  export type GetDesignOutputAggregateType<T extends DesignOutputAggregateArgs> = {
        [P in keyof T & keyof AggregateDesignOutput]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDesignOutput[P]>
      : GetScalarType<T[P], AggregateDesignOutput[P]>
  }




  export type DesignOutputGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DesignOutputWhereInput
    orderBy?: DesignOutputOrderByWithAggregationInput | DesignOutputOrderByWithAggregationInput[]
    by: DesignOutputScalarFieldEnum[] | DesignOutputScalarFieldEnum
    having?: DesignOutputScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DesignOutputCountAggregateInputType | true
    _min?: DesignOutputMinAggregateInputType
    _max?: DesignOutputMaxAggregateInputType
  }

  export type DesignOutputGroupByOutputType = {
    id: string
    designId: string
    outputImageUrl: string
    variationName: string | null
    generationParameters: JsonValue | null
    createdAt: Date
    _count: DesignOutputCountAggregateOutputType | null
    _min: DesignOutputMinAggregateOutputType | null
    _max: DesignOutputMaxAggregateOutputType | null
  }

  type GetDesignOutputGroupByPayload<T extends DesignOutputGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DesignOutputGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DesignOutputGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DesignOutputGroupByOutputType[P]>
            : GetScalarType<T[P], DesignOutputGroupByOutputType[P]>
        }
      >
    >


  export type DesignOutputSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    outputImageUrl?: boolean
    variationName?: boolean
    generationParameters?: boolean
    createdAt?: boolean
    design?: boolean | DesignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["designOutput"]>

  export type DesignOutputSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    outputImageUrl?: boolean
    variationName?: boolean
    generationParameters?: boolean
    createdAt?: boolean
    design?: boolean | DesignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["designOutput"]>

  export type DesignOutputSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    outputImageUrl?: boolean
    variationName?: boolean
    generationParameters?: boolean
    createdAt?: boolean
    design?: boolean | DesignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["designOutput"]>

  export type DesignOutputSelectScalar = {
    id?: boolean
    designId?: boolean
    outputImageUrl?: boolean
    variationName?: boolean
    generationParameters?: boolean
    createdAt?: boolean
  }

  export type DesignOutputOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "designId" | "outputImageUrl" | "variationName" | "generationParameters" | "createdAt", ExtArgs["result"]["designOutput"]>
  export type DesignOutputInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | DesignDefaultArgs<ExtArgs>
  }
  export type DesignOutputIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | DesignDefaultArgs<ExtArgs>
  }
  export type DesignOutputIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | DesignDefaultArgs<ExtArgs>
  }

  export type $DesignOutputPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DesignOutput"
    objects: {
      design: Prisma.$DesignPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      designId: string
      outputImageUrl: string
      variationName: string | null
      generationParameters: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["designOutput"]>
    composites: {}
  }

  type DesignOutputGetPayload<S extends boolean | null | undefined | DesignOutputDefaultArgs> = $Result.GetResult<Prisma.$DesignOutputPayload, S>

  type DesignOutputCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DesignOutputFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DesignOutputCountAggregateInputType | true
    }

  export interface DesignOutputDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DesignOutput'], meta: { name: 'DesignOutput' } }
    /**
     * Find zero or one DesignOutput that matches the filter.
     * @param {DesignOutputFindUniqueArgs} args - Arguments to find a DesignOutput
     * @example
     * // Get one DesignOutput
     * const designOutput = await prisma.designOutput.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DesignOutputFindUniqueArgs>(args: SelectSubset<T, DesignOutputFindUniqueArgs<ExtArgs>>): Prisma__DesignOutputClient<$Result.GetResult<Prisma.$DesignOutputPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DesignOutput that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DesignOutputFindUniqueOrThrowArgs} args - Arguments to find a DesignOutput
     * @example
     * // Get one DesignOutput
     * const designOutput = await prisma.designOutput.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DesignOutputFindUniqueOrThrowArgs>(args: SelectSubset<T, DesignOutputFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DesignOutputClient<$Result.GetResult<Prisma.$DesignOutputPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DesignOutput that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignOutputFindFirstArgs} args - Arguments to find a DesignOutput
     * @example
     * // Get one DesignOutput
     * const designOutput = await prisma.designOutput.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DesignOutputFindFirstArgs>(args?: SelectSubset<T, DesignOutputFindFirstArgs<ExtArgs>>): Prisma__DesignOutputClient<$Result.GetResult<Prisma.$DesignOutputPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DesignOutput that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignOutputFindFirstOrThrowArgs} args - Arguments to find a DesignOutput
     * @example
     * // Get one DesignOutput
     * const designOutput = await prisma.designOutput.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DesignOutputFindFirstOrThrowArgs>(args?: SelectSubset<T, DesignOutputFindFirstOrThrowArgs<ExtArgs>>): Prisma__DesignOutputClient<$Result.GetResult<Prisma.$DesignOutputPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DesignOutputs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignOutputFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DesignOutputs
     * const designOutputs = await prisma.designOutput.findMany()
     * 
     * // Get first 10 DesignOutputs
     * const designOutputs = await prisma.designOutput.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const designOutputWithIdOnly = await prisma.designOutput.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DesignOutputFindManyArgs>(args?: SelectSubset<T, DesignOutputFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DesignOutputPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DesignOutput.
     * @param {DesignOutputCreateArgs} args - Arguments to create a DesignOutput.
     * @example
     * // Create one DesignOutput
     * const DesignOutput = await prisma.designOutput.create({
     *   data: {
     *     // ... data to create a DesignOutput
     *   }
     * })
     * 
     */
    create<T extends DesignOutputCreateArgs>(args: SelectSubset<T, DesignOutputCreateArgs<ExtArgs>>): Prisma__DesignOutputClient<$Result.GetResult<Prisma.$DesignOutputPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DesignOutputs.
     * @param {DesignOutputCreateManyArgs} args - Arguments to create many DesignOutputs.
     * @example
     * // Create many DesignOutputs
     * const designOutput = await prisma.designOutput.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DesignOutputCreateManyArgs>(args?: SelectSubset<T, DesignOutputCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DesignOutputs and returns the data saved in the database.
     * @param {DesignOutputCreateManyAndReturnArgs} args - Arguments to create many DesignOutputs.
     * @example
     * // Create many DesignOutputs
     * const designOutput = await prisma.designOutput.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DesignOutputs and only return the `id`
     * const designOutputWithIdOnly = await prisma.designOutput.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DesignOutputCreateManyAndReturnArgs>(args?: SelectSubset<T, DesignOutputCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DesignOutputPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DesignOutput.
     * @param {DesignOutputDeleteArgs} args - Arguments to delete one DesignOutput.
     * @example
     * // Delete one DesignOutput
     * const DesignOutput = await prisma.designOutput.delete({
     *   where: {
     *     // ... filter to delete one DesignOutput
     *   }
     * })
     * 
     */
    delete<T extends DesignOutputDeleteArgs>(args: SelectSubset<T, DesignOutputDeleteArgs<ExtArgs>>): Prisma__DesignOutputClient<$Result.GetResult<Prisma.$DesignOutputPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DesignOutput.
     * @param {DesignOutputUpdateArgs} args - Arguments to update one DesignOutput.
     * @example
     * // Update one DesignOutput
     * const designOutput = await prisma.designOutput.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DesignOutputUpdateArgs>(args: SelectSubset<T, DesignOutputUpdateArgs<ExtArgs>>): Prisma__DesignOutputClient<$Result.GetResult<Prisma.$DesignOutputPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DesignOutputs.
     * @param {DesignOutputDeleteManyArgs} args - Arguments to filter DesignOutputs to delete.
     * @example
     * // Delete a few DesignOutputs
     * const { count } = await prisma.designOutput.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DesignOutputDeleteManyArgs>(args?: SelectSubset<T, DesignOutputDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DesignOutputs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignOutputUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DesignOutputs
     * const designOutput = await prisma.designOutput.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DesignOutputUpdateManyArgs>(args: SelectSubset<T, DesignOutputUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DesignOutputs and returns the data updated in the database.
     * @param {DesignOutputUpdateManyAndReturnArgs} args - Arguments to update many DesignOutputs.
     * @example
     * // Update many DesignOutputs
     * const designOutput = await prisma.designOutput.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DesignOutputs and only return the `id`
     * const designOutputWithIdOnly = await prisma.designOutput.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DesignOutputUpdateManyAndReturnArgs>(args: SelectSubset<T, DesignOutputUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DesignOutputPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DesignOutput.
     * @param {DesignOutputUpsertArgs} args - Arguments to update or create a DesignOutput.
     * @example
     * // Update or create a DesignOutput
     * const designOutput = await prisma.designOutput.upsert({
     *   create: {
     *     // ... data to create a DesignOutput
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DesignOutput we want to update
     *   }
     * })
     */
    upsert<T extends DesignOutputUpsertArgs>(args: SelectSubset<T, DesignOutputUpsertArgs<ExtArgs>>): Prisma__DesignOutputClient<$Result.GetResult<Prisma.$DesignOutputPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DesignOutputs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignOutputCountArgs} args - Arguments to filter DesignOutputs to count.
     * @example
     * // Count the number of DesignOutputs
     * const count = await prisma.designOutput.count({
     *   where: {
     *     // ... the filter for the DesignOutputs we want to count
     *   }
     * })
    **/
    count<T extends DesignOutputCountArgs>(
      args?: Subset<T, DesignOutputCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DesignOutputCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DesignOutput.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignOutputAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DesignOutputAggregateArgs>(args: Subset<T, DesignOutputAggregateArgs>): Prisma.PrismaPromise<GetDesignOutputAggregateType<T>>

    /**
     * Group by DesignOutput.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignOutputGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DesignOutputGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DesignOutputGroupByArgs['orderBy'] }
        : { orderBy?: DesignOutputGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DesignOutputGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDesignOutputGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DesignOutput model
   */
  readonly fields: DesignOutputFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DesignOutput.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DesignOutputClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    design<T extends DesignDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DesignDefaultArgs<ExtArgs>>): Prisma__DesignClient<$Result.GetResult<Prisma.$DesignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DesignOutput model
   */
  interface DesignOutputFieldRefs {
    readonly id: FieldRef<"DesignOutput", 'String'>
    readonly designId: FieldRef<"DesignOutput", 'String'>
    readonly outputImageUrl: FieldRef<"DesignOutput", 'String'>
    readonly variationName: FieldRef<"DesignOutput", 'String'>
    readonly generationParameters: FieldRef<"DesignOutput", 'Json'>
    readonly createdAt: FieldRef<"DesignOutput", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DesignOutput findUnique
   */
  export type DesignOutputFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DesignOutput
     */
    select?: DesignOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DesignOutput
     */
    omit?: DesignOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignOutputInclude<ExtArgs> | null
    /**
     * Filter, which DesignOutput to fetch.
     */
    where: DesignOutputWhereUniqueInput
  }

  /**
   * DesignOutput findUniqueOrThrow
   */
  export type DesignOutputFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DesignOutput
     */
    select?: DesignOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DesignOutput
     */
    omit?: DesignOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignOutputInclude<ExtArgs> | null
    /**
     * Filter, which DesignOutput to fetch.
     */
    where: DesignOutputWhereUniqueInput
  }

  /**
   * DesignOutput findFirst
   */
  export type DesignOutputFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DesignOutput
     */
    select?: DesignOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DesignOutput
     */
    omit?: DesignOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignOutputInclude<ExtArgs> | null
    /**
     * Filter, which DesignOutput to fetch.
     */
    where?: DesignOutputWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DesignOutputs to fetch.
     */
    orderBy?: DesignOutputOrderByWithRelationInput | DesignOutputOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DesignOutputs.
     */
    cursor?: DesignOutputWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DesignOutputs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DesignOutputs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DesignOutputs.
     */
    distinct?: DesignOutputScalarFieldEnum | DesignOutputScalarFieldEnum[]
  }

  /**
   * DesignOutput findFirstOrThrow
   */
  export type DesignOutputFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DesignOutput
     */
    select?: DesignOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DesignOutput
     */
    omit?: DesignOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignOutputInclude<ExtArgs> | null
    /**
     * Filter, which DesignOutput to fetch.
     */
    where?: DesignOutputWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DesignOutputs to fetch.
     */
    orderBy?: DesignOutputOrderByWithRelationInput | DesignOutputOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DesignOutputs.
     */
    cursor?: DesignOutputWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DesignOutputs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DesignOutputs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DesignOutputs.
     */
    distinct?: DesignOutputScalarFieldEnum | DesignOutputScalarFieldEnum[]
  }

  /**
   * DesignOutput findMany
   */
  export type DesignOutputFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DesignOutput
     */
    select?: DesignOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DesignOutput
     */
    omit?: DesignOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignOutputInclude<ExtArgs> | null
    /**
     * Filter, which DesignOutputs to fetch.
     */
    where?: DesignOutputWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DesignOutputs to fetch.
     */
    orderBy?: DesignOutputOrderByWithRelationInput | DesignOutputOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DesignOutputs.
     */
    cursor?: DesignOutputWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DesignOutputs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DesignOutputs.
     */
    skip?: number
    distinct?: DesignOutputScalarFieldEnum | DesignOutputScalarFieldEnum[]
  }

  /**
   * DesignOutput create
   */
  export type DesignOutputCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DesignOutput
     */
    select?: DesignOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DesignOutput
     */
    omit?: DesignOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignOutputInclude<ExtArgs> | null
    /**
     * The data needed to create a DesignOutput.
     */
    data: XOR<DesignOutputCreateInput, DesignOutputUncheckedCreateInput>
  }

  /**
   * DesignOutput createMany
   */
  export type DesignOutputCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DesignOutputs.
     */
    data: DesignOutputCreateManyInput | DesignOutputCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DesignOutput createManyAndReturn
   */
  export type DesignOutputCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DesignOutput
     */
    select?: DesignOutputSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DesignOutput
     */
    omit?: DesignOutputOmit<ExtArgs> | null
    /**
     * The data used to create many DesignOutputs.
     */
    data: DesignOutputCreateManyInput | DesignOutputCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignOutputIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DesignOutput update
   */
  export type DesignOutputUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DesignOutput
     */
    select?: DesignOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DesignOutput
     */
    omit?: DesignOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignOutputInclude<ExtArgs> | null
    /**
     * The data needed to update a DesignOutput.
     */
    data: XOR<DesignOutputUpdateInput, DesignOutputUncheckedUpdateInput>
    /**
     * Choose, which DesignOutput to update.
     */
    where: DesignOutputWhereUniqueInput
  }

  /**
   * DesignOutput updateMany
   */
  export type DesignOutputUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DesignOutputs.
     */
    data: XOR<DesignOutputUpdateManyMutationInput, DesignOutputUncheckedUpdateManyInput>
    /**
     * Filter which DesignOutputs to update
     */
    where?: DesignOutputWhereInput
    /**
     * Limit how many DesignOutputs to update.
     */
    limit?: number
  }

  /**
   * DesignOutput updateManyAndReturn
   */
  export type DesignOutputUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DesignOutput
     */
    select?: DesignOutputSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DesignOutput
     */
    omit?: DesignOutputOmit<ExtArgs> | null
    /**
     * The data used to update DesignOutputs.
     */
    data: XOR<DesignOutputUpdateManyMutationInput, DesignOutputUncheckedUpdateManyInput>
    /**
     * Filter which DesignOutputs to update
     */
    where?: DesignOutputWhereInput
    /**
     * Limit how many DesignOutputs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignOutputIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DesignOutput upsert
   */
  export type DesignOutputUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DesignOutput
     */
    select?: DesignOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DesignOutput
     */
    omit?: DesignOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignOutputInclude<ExtArgs> | null
    /**
     * The filter to search for the DesignOutput to update in case it exists.
     */
    where: DesignOutputWhereUniqueInput
    /**
     * In case the DesignOutput found by the `where` argument doesn't exist, create a new DesignOutput with this data.
     */
    create: XOR<DesignOutputCreateInput, DesignOutputUncheckedCreateInput>
    /**
     * In case the DesignOutput was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DesignOutputUpdateInput, DesignOutputUncheckedUpdateInput>
  }

  /**
   * DesignOutput delete
   */
  export type DesignOutputDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DesignOutput
     */
    select?: DesignOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DesignOutput
     */
    omit?: DesignOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignOutputInclude<ExtArgs> | null
    /**
     * Filter which DesignOutput to delete.
     */
    where: DesignOutputWhereUniqueInput
  }

  /**
   * DesignOutput deleteMany
   */
  export type DesignOutputDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DesignOutputs to delete
     */
    where?: DesignOutputWhereInput
    /**
     * Limit how many DesignOutputs to delete.
     */
    limit?: number
  }

  /**
   * DesignOutput without action
   */
  export type DesignOutputDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DesignOutput
     */
    select?: DesignOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DesignOutput
     */
    omit?: DesignOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignOutputInclude<ExtArgs> | null
  }


  /**
   * Model RoiCalculation
   */

  export type AggregateRoiCalculation = {
    _count: RoiCalculationCountAggregateOutputType | null
    _avg: RoiCalculationAvgAggregateOutputType | null
    _sum: RoiCalculationSumAggregateOutputType | null
    _min: RoiCalculationMinAggregateOutputType | null
    _max: RoiCalculationMaxAggregateOutputType | null
  }

  export type RoiCalculationAvgAggregateOutputType = {
    estimatedCost: number | null
    roiPercentage: number | null
  }

  export type RoiCalculationSumAggregateOutputType = {
    estimatedCost: number | null
    roiPercentage: number | null
  }

  export type RoiCalculationMinAggregateOutputType = {
    id: string | null
    designId: string | null
    estimatedCost: number | null
    roiPercentage: number | null
    paybackTimeline: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoiCalculationMaxAggregateOutputType = {
    id: string | null
    designId: string | null
    estimatedCost: number | null
    roiPercentage: number | null
    paybackTimeline: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoiCalculationCountAggregateOutputType = {
    id: number
    designId: number
    estimatedCost: number
    roiPercentage: number
    paybackTimeline: number
    costBreakdown: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RoiCalculationAvgAggregateInputType = {
    estimatedCost?: true
    roiPercentage?: true
  }

  export type RoiCalculationSumAggregateInputType = {
    estimatedCost?: true
    roiPercentage?: true
  }

  export type RoiCalculationMinAggregateInputType = {
    id?: true
    designId?: true
    estimatedCost?: true
    roiPercentage?: true
    paybackTimeline?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoiCalculationMaxAggregateInputType = {
    id?: true
    designId?: true
    estimatedCost?: true
    roiPercentage?: true
    paybackTimeline?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoiCalculationCountAggregateInputType = {
    id?: true
    designId?: true
    estimatedCost?: true
    roiPercentage?: true
    paybackTimeline?: true
    costBreakdown?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RoiCalculationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoiCalculation to aggregate.
     */
    where?: RoiCalculationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoiCalculations to fetch.
     */
    orderBy?: RoiCalculationOrderByWithRelationInput | RoiCalculationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoiCalculationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoiCalculations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoiCalculations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoiCalculations
    **/
    _count?: true | RoiCalculationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoiCalculationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoiCalculationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoiCalculationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoiCalculationMaxAggregateInputType
  }

  export type GetRoiCalculationAggregateType<T extends RoiCalculationAggregateArgs> = {
        [P in keyof T & keyof AggregateRoiCalculation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoiCalculation[P]>
      : GetScalarType<T[P], AggregateRoiCalculation[P]>
  }




  export type RoiCalculationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoiCalculationWhereInput
    orderBy?: RoiCalculationOrderByWithAggregationInput | RoiCalculationOrderByWithAggregationInput[]
    by: RoiCalculationScalarFieldEnum[] | RoiCalculationScalarFieldEnum
    having?: RoiCalculationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoiCalculationCountAggregateInputType | true
    _avg?: RoiCalculationAvgAggregateInputType
    _sum?: RoiCalculationSumAggregateInputType
    _min?: RoiCalculationMinAggregateInputType
    _max?: RoiCalculationMaxAggregateInputType
  }

  export type RoiCalculationGroupByOutputType = {
    id: string
    designId: string
    estimatedCost: number
    roiPercentage: number
    paybackTimeline: string | null
    costBreakdown: JsonValue | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: RoiCalculationCountAggregateOutputType | null
    _avg: RoiCalculationAvgAggregateOutputType | null
    _sum: RoiCalculationSumAggregateOutputType | null
    _min: RoiCalculationMinAggregateOutputType | null
    _max: RoiCalculationMaxAggregateOutputType | null
  }

  type GetRoiCalculationGroupByPayload<T extends RoiCalculationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoiCalculationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoiCalculationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoiCalculationGroupByOutputType[P]>
            : GetScalarType<T[P], RoiCalculationGroupByOutputType[P]>
        }
      >
    >


  export type RoiCalculationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    estimatedCost?: boolean
    roiPercentage?: boolean
    paybackTimeline?: boolean
    costBreakdown?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    design?: boolean | DesignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roiCalculation"]>

  export type RoiCalculationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    estimatedCost?: boolean
    roiPercentage?: boolean
    paybackTimeline?: boolean
    costBreakdown?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    design?: boolean | DesignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roiCalculation"]>

  export type RoiCalculationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    estimatedCost?: boolean
    roiPercentage?: boolean
    paybackTimeline?: boolean
    costBreakdown?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    design?: boolean | DesignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roiCalculation"]>

  export type RoiCalculationSelectScalar = {
    id?: boolean
    designId?: boolean
    estimatedCost?: boolean
    roiPercentage?: boolean
    paybackTimeline?: boolean
    costBreakdown?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RoiCalculationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "designId" | "estimatedCost" | "roiPercentage" | "paybackTimeline" | "costBreakdown" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["roiCalculation"]>
  export type RoiCalculationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | DesignDefaultArgs<ExtArgs>
  }
  export type RoiCalculationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | DesignDefaultArgs<ExtArgs>
  }
  export type RoiCalculationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | DesignDefaultArgs<ExtArgs>
  }

  export type $RoiCalculationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoiCalculation"
    objects: {
      design: Prisma.$DesignPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      designId: string
      estimatedCost: number
      roiPercentage: number
      paybackTimeline: string | null
      costBreakdown: Prisma.JsonValue | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["roiCalculation"]>
    composites: {}
  }

  type RoiCalculationGetPayload<S extends boolean | null | undefined | RoiCalculationDefaultArgs> = $Result.GetResult<Prisma.$RoiCalculationPayload, S>

  type RoiCalculationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoiCalculationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoiCalculationCountAggregateInputType | true
    }

  export interface RoiCalculationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoiCalculation'], meta: { name: 'RoiCalculation' } }
    /**
     * Find zero or one RoiCalculation that matches the filter.
     * @param {RoiCalculationFindUniqueArgs} args - Arguments to find a RoiCalculation
     * @example
     * // Get one RoiCalculation
     * const roiCalculation = await prisma.roiCalculation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoiCalculationFindUniqueArgs>(args: SelectSubset<T, RoiCalculationFindUniqueArgs<ExtArgs>>): Prisma__RoiCalculationClient<$Result.GetResult<Prisma.$RoiCalculationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RoiCalculation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoiCalculationFindUniqueOrThrowArgs} args - Arguments to find a RoiCalculation
     * @example
     * // Get one RoiCalculation
     * const roiCalculation = await prisma.roiCalculation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoiCalculationFindUniqueOrThrowArgs>(args: SelectSubset<T, RoiCalculationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoiCalculationClient<$Result.GetResult<Prisma.$RoiCalculationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoiCalculation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoiCalculationFindFirstArgs} args - Arguments to find a RoiCalculation
     * @example
     * // Get one RoiCalculation
     * const roiCalculation = await prisma.roiCalculation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoiCalculationFindFirstArgs>(args?: SelectSubset<T, RoiCalculationFindFirstArgs<ExtArgs>>): Prisma__RoiCalculationClient<$Result.GetResult<Prisma.$RoiCalculationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoiCalculation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoiCalculationFindFirstOrThrowArgs} args - Arguments to find a RoiCalculation
     * @example
     * // Get one RoiCalculation
     * const roiCalculation = await prisma.roiCalculation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoiCalculationFindFirstOrThrowArgs>(args?: SelectSubset<T, RoiCalculationFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoiCalculationClient<$Result.GetResult<Prisma.$RoiCalculationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RoiCalculations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoiCalculationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoiCalculations
     * const roiCalculations = await prisma.roiCalculation.findMany()
     * 
     * // Get first 10 RoiCalculations
     * const roiCalculations = await prisma.roiCalculation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roiCalculationWithIdOnly = await prisma.roiCalculation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoiCalculationFindManyArgs>(args?: SelectSubset<T, RoiCalculationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoiCalculationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RoiCalculation.
     * @param {RoiCalculationCreateArgs} args - Arguments to create a RoiCalculation.
     * @example
     * // Create one RoiCalculation
     * const RoiCalculation = await prisma.roiCalculation.create({
     *   data: {
     *     // ... data to create a RoiCalculation
     *   }
     * })
     * 
     */
    create<T extends RoiCalculationCreateArgs>(args: SelectSubset<T, RoiCalculationCreateArgs<ExtArgs>>): Prisma__RoiCalculationClient<$Result.GetResult<Prisma.$RoiCalculationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RoiCalculations.
     * @param {RoiCalculationCreateManyArgs} args - Arguments to create many RoiCalculations.
     * @example
     * // Create many RoiCalculations
     * const roiCalculation = await prisma.roiCalculation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoiCalculationCreateManyArgs>(args?: SelectSubset<T, RoiCalculationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoiCalculations and returns the data saved in the database.
     * @param {RoiCalculationCreateManyAndReturnArgs} args - Arguments to create many RoiCalculations.
     * @example
     * // Create many RoiCalculations
     * const roiCalculation = await prisma.roiCalculation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoiCalculations and only return the `id`
     * const roiCalculationWithIdOnly = await prisma.roiCalculation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoiCalculationCreateManyAndReturnArgs>(args?: SelectSubset<T, RoiCalculationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoiCalculationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RoiCalculation.
     * @param {RoiCalculationDeleteArgs} args - Arguments to delete one RoiCalculation.
     * @example
     * // Delete one RoiCalculation
     * const RoiCalculation = await prisma.roiCalculation.delete({
     *   where: {
     *     // ... filter to delete one RoiCalculation
     *   }
     * })
     * 
     */
    delete<T extends RoiCalculationDeleteArgs>(args: SelectSubset<T, RoiCalculationDeleteArgs<ExtArgs>>): Prisma__RoiCalculationClient<$Result.GetResult<Prisma.$RoiCalculationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RoiCalculation.
     * @param {RoiCalculationUpdateArgs} args - Arguments to update one RoiCalculation.
     * @example
     * // Update one RoiCalculation
     * const roiCalculation = await prisma.roiCalculation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoiCalculationUpdateArgs>(args: SelectSubset<T, RoiCalculationUpdateArgs<ExtArgs>>): Prisma__RoiCalculationClient<$Result.GetResult<Prisma.$RoiCalculationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RoiCalculations.
     * @param {RoiCalculationDeleteManyArgs} args - Arguments to filter RoiCalculations to delete.
     * @example
     * // Delete a few RoiCalculations
     * const { count } = await prisma.roiCalculation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoiCalculationDeleteManyArgs>(args?: SelectSubset<T, RoiCalculationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoiCalculations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoiCalculationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoiCalculations
     * const roiCalculation = await prisma.roiCalculation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoiCalculationUpdateManyArgs>(args: SelectSubset<T, RoiCalculationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoiCalculations and returns the data updated in the database.
     * @param {RoiCalculationUpdateManyAndReturnArgs} args - Arguments to update many RoiCalculations.
     * @example
     * // Update many RoiCalculations
     * const roiCalculation = await prisma.roiCalculation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RoiCalculations and only return the `id`
     * const roiCalculationWithIdOnly = await prisma.roiCalculation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoiCalculationUpdateManyAndReturnArgs>(args: SelectSubset<T, RoiCalculationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoiCalculationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RoiCalculation.
     * @param {RoiCalculationUpsertArgs} args - Arguments to update or create a RoiCalculation.
     * @example
     * // Update or create a RoiCalculation
     * const roiCalculation = await prisma.roiCalculation.upsert({
     *   create: {
     *     // ... data to create a RoiCalculation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoiCalculation we want to update
     *   }
     * })
     */
    upsert<T extends RoiCalculationUpsertArgs>(args: SelectSubset<T, RoiCalculationUpsertArgs<ExtArgs>>): Prisma__RoiCalculationClient<$Result.GetResult<Prisma.$RoiCalculationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RoiCalculations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoiCalculationCountArgs} args - Arguments to filter RoiCalculations to count.
     * @example
     * // Count the number of RoiCalculations
     * const count = await prisma.roiCalculation.count({
     *   where: {
     *     // ... the filter for the RoiCalculations we want to count
     *   }
     * })
    **/
    count<T extends RoiCalculationCountArgs>(
      args?: Subset<T, RoiCalculationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoiCalculationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoiCalculation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoiCalculationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoiCalculationAggregateArgs>(args: Subset<T, RoiCalculationAggregateArgs>): Prisma.PrismaPromise<GetRoiCalculationAggregateType<T>>

    /**
     * Group by RoiCalculation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoiCalculationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoiCalculationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoiCalculationGroupByArgs['orderBy'] }
        : { orderBy?: RoiCalculationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoiCalculationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoiCalculationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoiCalculation model
   */
  readonly fields: RoiCalculationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoiCalculation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoiCalculationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    design<T extends DesignDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DesignDefaultArgs<ExtArgs>>): Prisma__DesignClient<$Result.GetResult<Prisma.$DesignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RoiCalculation model
   */
  interface RoiCalculationFieldRefs {
    readonly id: FieldRef<"RoiCalculation", 'String'>
    readonly designId: FieldRef<"RoiCalculation", 'String'>
    readonly estimatedCost: FieldRef<"RoiCalculation", 'Float'>
    readonly roiPercentage: FieldRef<"RoiCalculation", 'Float'>
    readonly paybackTimeline: FieldRef<"RoiCalculation", 'String'>
    readonly costBreakdown: FieldRef<"RoiCalculation", 'Json'>
    readonly notes: FieldRef<"RoiCalculation", 'String'>
    readonly createdAt: FieldRef<"RoiCalculation", 'DateTime'>
    readonly updatedAt: FieldRef<"RoiCalculation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RoiCalculation findUnique
   */
  export type RoiCalculationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoiCalculation
     */
    select?: RoiCalculationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoiCalculation
     */
    omit?: RoiCalculationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoiCalculationInclude<ExtArgs> | null
    /**
     * Filter, which RoiCalculation to fetch.
     */
    where: RoiCalculationWhereUniqueInput
  }

  /**
   * RoiCalculation findUniqueOrThrow
   */
  export type RoiCalculationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoiCalculation
     */
    select?: RoiCalculationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoiCalculation
     */
    omit?: RoiCalculationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoiCalculationInclude<ExtArgs> | null
    /**
     * Filter, which RoiCalculation to fetch.
     */
    where: RoiCalculationWhereUniqueInput
  }

  /**
   * RoiCalculation findFirst
   */
  export type RoiCalculationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoiCalculation
     */
    select?: RoiCalculationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoiCalculation
     */
    omit?: RoiCalculationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoiCalculationInclude<ExtArgs> | null
    /**
     * Filter, which RoiCalculation to fetch.
     */
    where?: RoiCalculationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoiCalculations to fetch.
     */
    orderBy?: RoiCalculationOrderByWithRelationInput | RoiCalculationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoiCalculations.
     */
    cursor?: RoiCalculationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoiCalculations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoiCalculations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoiCalculations.
     */
    distinct?: RoiCalculationScalarFieldEnum | RoiCalculationScalarFieldEnum[]
  }

  /**
   * RoiCalculation findFirstOrThrow
   */
  export type RoiCalculationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoiCalculation
     */
    select?: RoiCalculationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoiCalculation
     */
    omit?: RoiCalculationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoiCalculationInclude<ExtArgs> | null
    /**
     * Filter, which RoiCalculation to fetch.
     */
    where?: RoiCalculationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoiCalculations to fetch.
     */
    orderBy?: RoiCalculationOrderByWithRelationInput | RoiCalculationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoiCalculations.
     */
    cursor?: RoiCalculationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoiCalculations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoiCalculations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoiCalculations.
     */
    distinct?: RoiCalculationScalarFieldEnum | RoiCalculationScalarFieldEnum[]
  }

  /**
   * RoiCalculation findMany
   */
  export type RoiCalculationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoiCalculation
     */
    select?: RoiCalculationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoiCalculation
     */
    omit?: RoiCalculationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoiCalculationInclude<ExtArgs> | null
    /**
     * Filter, which RoiCalculations to fetch.
     */
    where?: RoiCalculationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoiCalculations to fetch.
     */
    orderBy?: RoiCalculationOrderByWithRelationInput | RoiCalculationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoiCalculations.
     */
    cursor?: RoiCalculationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoiCalculations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoiCalculations.
     */
    skip?: number
    distinct?: RoiCalculationScalarFieldEnum | RoiCalculationScalarFieldEnum[]
  }

  /**
   * RoiCalculation create
   */
  export type RoiCalculationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoiCalculation
     */
    select?: RoiCalculationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoiCalculation
     */
    omit?: RoiCalculationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoiCalculationInclude<ExtArgs> | null
    /**
     * The data needed to create a RoiCalculation.
     */
    data: XOR<RoiCalculationCreateInput, RoiCalculationUncheckedCreateInput>
  }

  /**
   * RoiCalculation createMany
   */
  export type RoiCalculationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoiCalculations.
     */
    data: RoiCalculationCreateManyInput | RoiCalculationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoiCalculation createManyAndReturn
   */
  export type RoiCalculationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoiCalculation
     */
    select?: RoiCalculationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoiCalculation
     */
    omit?: RoiCalculationOmit<ExtArgs> | null
    /**
     * The data used to create many RoiCalculations.
     */
    data: RoiCalculationCreateManyInput | RoiCalculationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoiCalculationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoiCalculation update
   */
  export type RoiCalculationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoiCalculation
     */
    select?: RoiCalculationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoiCalculation
     */
    omit?: RoiCalculationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoiCalculationInclude<ExtArgs> | null
    /**
     * The data needed to update a RoiCalculation.
     */
    data: XOR<RoiCalculationUpdateInput, RoiCalculationUncheckedUpdateInput>
    /**
     * Choose, which RoiCalculation to update.
     */
    where: RoiCalculationWhereUniqueInput
  }

  /**
   * RoiCalculation updateMany
   */
  export type RoiCalculationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoiCalculations.
     */
    data: XOR<RoiCalculationUpdateManyMutationInput, RoiCalculationUncheckedUpdateManyInput>
    /**
     * Filter which RoiCalculations to update
     */
    where?: RoiCalculationWhereInput
    /**
     * Limit how many RoiCalculations to update.
     */
    limit?: number
  }

  /**
   * RoiCalculation updateManyAndReturn
   */
  export type RoiCalculationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoiCalculation
     */
    select?: RoiCalculationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoiCalculation
     */
    omit?: RoiCalculationOmit<ExtArgs> | null
    /**
     * The data used to update RoiCalculations.
     */
    data: XOR<RoiCalculationUpdateManyMutationInput, RoiCalculationUncheckedUpdateManyInput>
    /**
     * Filter which RoiCalculations to update
     */
    where?: RoiCalculationWhereInput
    /**
     * Limit how many RoiCalculations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoiCalculationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoiCalculation upsert
   */
  export type RoiCalculationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoiCalculation
     */
    select?: RoiCalculationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoiCalculation
     */
    omit?: RoiCalculationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoiCalculationInclude<ExtArgs> | null
    /**
     * The filter to search for the RoiCalculation to update in case it exists.
     */
    where: RoiCalculationWhereUniqueInput
    /**
     * In case the RoiCalculation found by the `where` argument doesn't exist, create a new RoiCalculation with this data.
     */
    create: XOR<RoiCalculationCreateInput, RoiCalculationUncheckedCreateInput>
    /**
     * In case the RoiCalculation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoiCalculationUpdateInput, RoiCalculationUncheckedUpdateInput>
  }

  /**
   * RoiCalculation delete
   */
  export type RoiCalculationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoiCalculation
     */
    select?: RoiCalculationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoiCalculation
     */
    omit?: RoiCalculationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoiCalculationInclude<ExtArgs> | null
    /**
     * Filter which RoiCalculation to delete.
     */
    where: RoiCalculationWhereUniqueInput
  }

  /**
   * RoiCalculation deleteMany
   */
  export type RoiCalculationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoiCalculations to delete
     */
    where?: RoiCalculationWhereInput
    /**
     * Limit how many RoiCalculations to delete.
     */
    limit?: number
  }

  /**
   * RoiCalculation without action
   */
  export type RoiCalculationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoiCalculation
     */
    select?: RoiCalculationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoiCalculation
     */
    omit?: RoiCalculationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoiCalculationInclude<ExtArgs> | null
  }


  /**
   * Model Feedback
   */

  export type AggregateFeedback = {
    _count: FeedbackCountAggregateOutputType | null
    _avg: FeedbackAvgAggregateOutputType | null
    _sum: FeedbackSumAggregateOutputType | null
    _min: FeedbackMinAggregateOutputType | null
    _max: FeedbackMaxAggregateOutputType | null
  }

  export type FeedbackAvgAggregateOutputType = {
    rating: number | null
  }

  export type FeedbackSumAggregateOutputType = {
    rating: number | null
  }

  export type FeedbackMinAggregateOutputType = {
    id: string | null
    designId: string | null
    userId: string | null
    rating: number | null
    comments: string | null
    type: $Enums.FeedbackType | null
    helpful: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FeedbackMaxAggregateOutputType = {
    id: string | null
    designId: string | null
    userId: string | null
    rating: number | null
    comments: string | null
    type: $Enums.FeedbackType | null
    helpful: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FeedbackCountAggregateOutputType = {
    id: number
    designId: number
    userId: number
    rating: number
    comments: number
    type: number
    helpful: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FeedbackAvgAggregateInputType = {
    rating?: true
  }

  export type FeedbackSumAggregateInputType = {
    rating?: true
  }

  export type FeedbackMinAggregateInputType = {
    id?: true
    designId?: true
    userId?: true
    rating?: true
    comments?: true
    type?: true
    helpful?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FeedbackMaxAggregateInputType = {
    id?: true
    designId?: true
    userId?: true
    rating?: true
    comments?: true
    type?: true
    helpful?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FeedbackCountAggregateInputType = {
    id?: true
    designId?: true
    userId?: true
    rating?: true
    comments?: true
    type?: true
    helpful?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FeedbackAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Feedback to aggregate.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Feedbacks
    **/
    _count?: true | FeedbackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FeedbackAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FeedbackSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FeedbackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FeedbackMaxAggregateInputType
  }

  export type GetFeedbackAggregateType<T extends FeedbackAggregateArgs> = {
        [P in keyof T & keyof AggregateFeedback]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFeedback[P]>
      : GetScalarType<T[P], AggregateFeedback[P]>
  }




  export type FeedbackGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FeedbackWhereInput
    orderBy?: FeedbackOrderByWithAggregationInput | FeedbackOrderByWithAggregationInput[]
    by: FeedbackScalarFieldEnum[] | FeedbackScalarFieldEnum
    having?: FeedbackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FeedbackCountAggregateInputType | true
    _avg?: FeedbackAvgAggregateInputType
    _sum?: FeedbackSumAggregateInputType
    _min?: FeedbackMinAggregateInputType
    _max?: FeedbackMaxAggregateInputType
  }

  export type FeedbackGroupByOutputType = {
    id: string
    designId: string
    userId: string
    rating: number
    comments: string | null
    type: $Enums.FeedbackType
    helpful: boolean | null
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: FeedbackCountAggregateOutputType | null
    _avg: FeedbackAvgAggregateOutputType | null
    _sum: FeedbackSumAggregateOutputType | null
    _min: FeedbackMinAggregateOutputType | null
    _max: FeedbackMaxAggregateOutputType | null
  }

  type GetFeedbackGroupByPayload<T extends FeedbackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FeedbackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FeedbackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FeedbackGroupByOutputType[P]>
            : GetScalarType<T[P], FeedbackGroupByOutputType[P]>
        }
      >
    >


  export type FeedbackSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    userId?: boolean
    rating?: boolean
    comments?: boolean
    type?: boolean
    helpful?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    design?: boolean | DesignDefaultArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["feedback"]>

  export type FeedbackSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    userId?: boolean
    rating?: boolean
    comments?: boolean
    type?: boolean
    helpful?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    design?: boolean | DesignDefaultArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["feedback"]>

  export type FeedbackSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    userId?: boolean
    rating?: boolean
    comments?: boolean
    type?: boolean
    helpful?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    design?: boolean | DesignDefaultArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["feedback"]>

  export type FeedbackSelectScalar = {
    id?: boolean
    designId?: boolean
    userId?: boolean
    rating?: boolean
    comments?: boolean
    type?: boolean
    helpful?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FeedbackOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "designId" | "userId" | "rating" | "comments" | "type" | "helpful" | "metadata" | "createdAt" | "updatedAt", ExtArgs["result"]["feedback"]>
  export type FeedbackInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | DesignDefaultArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type FeedbackIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | DesignDefaultArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type FeedbackIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | DesignDefaultArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $FeedbackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Feedback"
    objects: {
      design: Prisma.$DesignPayload<ExtArgs>
      profile: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      designId: string
      userId: string
      rating: number
      comments: string | null
      type: $Enums.FeedbackType
      helpful: boolean | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["feedback"]>
    composites: {}
  }

  type FeedbackGetPayload<S extends boolean | null | undefined | FeedbackDefaultArgs> = $Result.GetResult<Prisma.$FeedbackPayload, S>

  type FeedbackCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FeedbackFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FeedbackCountAggregateInputType | true
    }

  export interface FeedbackDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Feedback'], meta: { name: 'Feedback' } }
    /**
     * Find zero or one Feedback that matches the filter.
     * @param {FeedbackFindUniqueArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FeedbackFindUniqueArgs>(args: SelectSubset<T, FeedbackFindUniqueArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Feedback that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FeedbackFindUniqueOrThrowArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FeedbackFindUniqueOrThrowArgs>(args: SelectSubset<T, FeedbackFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feedback that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackFindFirstArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FeedbackFindFirstArgs>(args?: SelectSubset<T, FeedbackFindFirstArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feedback that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackFindFirstOrThrowArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FeedbackFindFirstOrThrowArgs>(args?: SelectSubset<T, FeedbackFindFirstOrThrowArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Feedbacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Feedbacks
     * const feedbacks = await prisma.feedback.findMany()
     * 
     * // Get first 10 Feedbacks
     * const feedbacks = await prisma.feedback.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const feedbackWithIdOnly = await prisma.feedback.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FeedbackFindManyArgs>(args?: SelectSubset<T, FeedbackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Feedback.
     * @param {FeedbackCreateArgs} args - Arguments to create a Feedback.
     * @example
     * // Create one Feedback
     * const Feedback = await prisma.feedback.create({
     *   data: {
     *     // ... data to create a Feedback
     *   }
     * })
     * 
     */
    create<T extends FeedbackCreateArgs>(args: SelectSubset<T, FeedbackCreateArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Feedbacks.
     * @param {FeedbackCreateManyArgs} args - Arguments to create many Feedbacks.
     * @example
     * // Create many Feedbacks
     * const feedback = await prisma.feedback.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FeedbackCreateManyArgs>(args?: SelectSubset<T, FeedbackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Feedbacks and returns the data saved in the database.
     * @param {FeedbackCreateManyAndReturnArgs} args - Arguments to create many Feedbacks.
     * @example
     * // Create many Feedbacks
     * const feedback = await prisma.feedback.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Feedbacks and only return the `id`
     * const feedbackWithIdOnly = await prisma.feedback.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FeedbackCreateManyAndReturnArgs>(args?: SelectSubset<T, FeedbackCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Feedback.
     * @param {FeedbackDeleteArgs} args - Arguments to delete one Feedback.
     * @example
     * // Delete one Feedback
     * const Feedback = await prisma.feedback.delete({
     *   where: {
     *     // ... filter to delete one Feedback
     *   }
     * })
     * 
     */
    delete<T extends FeedbackDeleteArgs>(args: SelectSubset<T, FeedbackDeleteArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Feedback.
     * @param {FeedbackUpdateArgs} args - Arguments to update one Feedback.
     * @example
     * // Update one Feedback
     * const feedback = await prisma.feedback.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FeedbackUpdateArgs>(args: SelectSubset<T, FeedbackUpdateArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Feedbacks.
     * @param {FeedbackDeleteManyArgs} args - Arguments to filter Feedbacks to delete.
     * @example
     * // Delete a few Feedbacks
     * const { count } = await prisma.feedback.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FeedbackDeleteManyArgs>(args?: SelectSubset<T, FeedbackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Feedbacks
     * const feedback = await prisma.feedback.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FeedbackUpdateManyArgs>(args: SelectSubset<T, FeedbackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Feedbacks and returns the data updated in the database.
     * @param {FeedbackUpdateManyAndReturnArgs} args - Arguments to update many Feedbacks.
     * @example
     * // Update many Feedbacks
     * const feedback = await prisma.feedback.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Feedbacks and only return the `id`
     * const feedbackWithIdOnly = await prisma.feedback.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FeedbackUpdateManyAndReturnArgs>(args: SelectSubset<T, FeedbackUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Feedback.
     * @param {FeedbackUpsertArgs} args - Arguments to update or create a Feedback.
     * @example
     * // Update or create a Feedback
     * const feedback = await prisma.feedback.upsert({
     *   create: {
     *     // ... data to create a Feedback
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Feedback we want to update
     *   }
     * })
     */
    upsert<T extends FeedbackUpsertArgs>(args: SelectSubset<T, FeedbackUpsertArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackCountArgs} args - Arguments to filter Feedbacks to count.
     * @example
     * // Count the number of Feedbacks
     * const count = await prisma.feedback.count({
     *   where: {
     *     // ... the filter for the Feedbacks we want to count
     *   }
     * })
    **/
    count<T extends FeedbackCountArgs>(
      args?: Subset<T, FeedbackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FeedbackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Feedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FeedbackAggregateArgs>(args: Subset<T, FeedbackAggregateArgs>): Prisma.PrismaPromise<GetFeedbackAggregateType<T>>

    /**
     * Group by Feedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FeedbackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FeedbackGroupByArgs['orderBy'] }
        : { orderBy?: FeedbackGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FeedbackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFeedbackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Feedback model
   */
  readonly fields: FeedbackFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Feedback.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FeedbackClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    design<T extends DesignDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DesignDefaultArgs<ExtArgs>>): Prisma__DesignClient<$Result.GetResult<Prisma.$DesignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Feedback model
   */
  interface FeedbackFieldRefs {
    readonly id: FieldRef<"Feedback", 'String'>
    readonly designId: FieldRef<"Feedback", 'String'>
    readonly userId: FieldRef<"Feedback", 'String'>
    readonly rating: FieldRef<"Feedback", 'Int'>
    readonly comments: FieldRef<"Feedback", 'String'>
    readonly type: FieldRef<"Feedback", 'FeedbackType'>
    readonly helpful: FieldRef<"Feedback", 'Boolean'>
    readonly metadata: FieldRef<"Feedback", 'Json'>
    readonly createdAt: FieldRef<"Feedback", 'DateTime'>
    readonly updatedAt: FieldRef<"Feedback", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Feedback findUnique
   */
  export type FeedbackFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback findUniqueOrThrow
   */
  export type FeedbackFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback findFirst
   */
  export type FeedbackFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Feedbacks.
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Feedbacks.
     */
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * Feedback findFirstOrThrow
   */
  export type FeedbackFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Feedbacks.
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Feedbacks.
     */
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * Feedback findMany
   */
  export type FeedbackFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedbacks to fetch.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Feedbacks.
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * Feedback create
   */
  export type FeedbackCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * The data needed to create a Feedback.
     */
    data: XOR<FeedbackCreateInput, FeedbackUncheckedCreateInput>
  }

  /**
   * Feedback createMany
   */
  export type FeedbackCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Feedbacks.
     */
    data: FeedbackCreateManyInput | FeedbackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Feedback createManyAndReturn
   */
  export type FeedbackCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * The data used to create many Feedbacks.
     */
    data: FeedbackCreateManyInput | FeedbackCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Feedback update
   */
  export type FeedbackUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * The data needed to update a Feedback.
     */
    data: XOR<FeedbackUpdateInput, FeedbackUncheckedUpdateInput>
    /**
     * Choose, which Feedback to update.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback updateMany
   */
  export type FeedbackUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Feedbacks.
     */
    data: XOR<FeedbackUpdateManyMutationInput, FeedbackUncheckedUpdateManyInput>
    /**
     * Filter which Feedbacks to update
     */
    where?: FeedbackWhereInput
    /**
     * Limit how many Feedbacks to update.
     */
    limit?: number
  }

  /**
   * Feedback updateManyAndReturn
   */
  export type FeedbackUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * The data used to update Feedbacks.
     */
    data: XOR<FeedbackUpdateManyMutationInput, FeedbackUncheckedUpdateManyInput>
    /**
     * Filter which Feedbacks to update
     */
    where?: FeedbackWhereInput
    /**
     * Limit how many Feedbacks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Feedback upsert
   */
  export type FeedbackUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * The filter to search for the Feedback to update in case it exists.
     */
    where: FeedbackWhereUniqueInput
    /**
     * In case the Feedback found by the `where` argument doesn't exist, create a new Feedback with this data.
     */
    create: XOR<FeedbackCreateInput, FeedbackUncheckedCreateInput>
    /**
     * In case the Feedback was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FeedbackUpdateInput, FeedbackUncheckedUpdateInput>
  }

  /**
   * Feedback delete
   */
  export type FeedbackDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter which Feedback to delete.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback deleteMany
   */
  export type FeedbackDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Feedbacks to delete
     */
    where?: FeedbackWhereInput
    /**
     * Limit how many Feedbacks to delete.
     */
    limit?: number
  }

  /**
   * Feedback without action
   */
  export type FeedbackDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    company: 'company',
    role: 'role',
    avatar: 'avatar',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProfileScalarFieldEnum = (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum]


  export const DesignScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    inputPrompt: 'inputPrompt',
    uploadedImageUrl: 'uploadedImageUrl',
    aiModelUsed: 'aiModelUsed',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DesignScalarFieldEnum = (typeof DesignScalarFieldEnum)[keyof typeof DesignScalarFieldEnum]


  export const PreferencesScalarFieldEnum: {
    id: 'id',
    designId: 'designId',
    roomType: 'roomType',
    size: 'size',
    stylePreference: 'stylePreference',
    budget: 'budget',
    colorScheme: 'colorScheme',
    materialPreferences: 'materialPreferences',
    otherRequirements: 'otherRequirements',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PreferencesScalarFieldEnum = (typeof PreferencesScalarFieldEnum)[keyof typeof PreferencesScalarFieldEnum]


  export const DesignOutputScalarFieldEnum: {
    id: 'id',
    designId: 'designId',
    outputImageUrl: 'outputImageUrl',
    variationName: 'variationName',
    generationParameters: 'generationParameters',
    createdAt: 'createdAt'
  };

  export type DesignOutputScalarFieldEnum = (typeof DesignOutputScalarFieldEnum)[keyof typeof DesignOutputScalarFieldEnum]


  export const RoiCalculationScalarFieldEnum: {
    id: 'id',
    designId: 'designId',
    estimatedCost: 'estimatedCost',
    roiPercentage: 'roiPercentage',
    paybackTimeline: 'paybackTimeline',
    costBreakdown: 'costBreakdown',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RoiCalculationScalarFieldEnum = (typeof RoiCalculationScalarFieldEnum)[keyof typeof RoiCalculationScalarFieldEnum]


  export const FeedbackScalarFieldEnum: {
    id: 'id',
    designId: 'designId',
    userId: 'userId',
    rating: 'rating',
    comments: 'comments',
    type: 'type',
    helpful: 'helpful',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FeedbackScalarFieldEnum = (typeof FeedbackScalarFieldEnum)[keyof typeof FeedbackScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'DesignStatus'
   */
  export type EnumDesignStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DesignStatus'>
    


  /**
   * Reference to a field of type 'DesignStatus[]'
   */
  export type ListEnumDesignStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DesignStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'FeedbackType'
   */
  export type EnumFeedbackTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FeedbackType'>
    


  /**
   * Reference to a field of type 'FeedbackType[]'
   */
  export type ListEnumFeedbackTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FeedbackType[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type ProfileWhereInput = {
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    id?: UuidFilter<"Profile"> | string
    userId?: UuidFilter<"Profile"> | string
    name?: StringNullableFilter<"Profile"> | string | null
    company?: StringNullableFilter<"Profile"> | string | null
    role?: EnumUserRoleFilter<"Profile"> | $Enums.UserRole
    avatar?: StringNullableFilter<"Profile"> | string | null
    createdAt?: DateTimeFilter<"Profile"> | Date | string
    updatedAt?: DateTimeFilter<"Profile"> | Date | string
    designs?: DesignListRelationFilter
    feedback?: FeedbackListRelationFilter
  }

  export type ProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrderInput | SortOrder
    company?: SortOrderInput | SortOrder
    role?: SortOrder
    avatar?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    designs?: DesignOrderByRelationAggregateInput
    feedback?: FeedbackOrderByRelationAggregateInput
  }

  export type ProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    name?: StringNullableFilter<"Profile"> | string | null
    company?: StringNullableFilter<"Profile"> | string | null
    role?: EnumUserRoleFilter<"Profile"> | $Enums.UserRole
    avatar?: StringNullableFilter<"Profile"> | string | null
    createdAt?: DateTimeFilter<"Profile"> | Date | string
    updatedAt?: DateTimeFilter<"Profile"> | Date | string
    designs?: DesignListRelationFilter
    feedback?: FeedbackListRelationFilter
  }, "id" | "userId">

  export type ProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrderInput | SortOrder
    company?: SortOrderInput | SortOrder
    role?: SortOrder
    avatar?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProfileCountOrderByAggregateInput
    _max?: ProfileMaxOrderByAggregateInput
    _min?: ProfileMinOrderByAggregateInput
  }

  export type ProfileScalarWhereWithAggregatesInput = {
    AND?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    OR?: ProfileScalarWhereWithAggregatesInput[]
    NOT?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Profile"> | string
    userId?: UuidWithAggregatesFilter<"Profile"> | string
    name?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    company?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"Profile"> | $Enums.UserRole
    avatar?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
  }

  export type DesignWhereInput = {
    AND?: DesignWhereInput | DesignWhereInput[]
    OR?: DesignWhereInput[]
    NOT?: DesignWhereInput | DesignWhereInput[]
    id?: UuidFilter<"Design"> | string
    userId?: UuidFilter<"Design"> | string
    inputPrompt?: StringFilter<"Design"> | string
    uploadedImageUrl?: StringNullableFilter<"Design"> | string | null
    aiModelUsed?: StringFilter<"Design"> | string
    status?: EnumDesignStatusFilter<"Design"> | $Enums.DesignStatus
    createdAt?: DateTimeFilter<"Design"> | Date | string
    updatedAt?: DateTimeFilter<"Design"> | Date | string
    designOutputs?: DesignOutputListRelationFilter
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    feedback?: FeedbackListRelationFilter
    preferences?: XOR<PreferencesNullableScalarRelationFilter, PreferencesWhereInput> | null
    roiCalculation?: XOR<RoiCalculationNullableScalarRelationFilter, RoiCalculationWhereInput> | null
  }

  export type DesignOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    inputPrompt?: SortOrder
    uploadedImageUrl?: SortOrderInput | SortOrder
    aiModelUsed?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    designOutputs?: DesignOutputOrderByRelationAggregateInput
    profile?: ProfileOrderByWithRelationInput
    feedback?: FeedbackOrderByRelationAggregateInput
    preferences?: PreferencesOrderByWithRelationInput
    roiCalculation?: RoiCalculationOrderByWithRelationInput
  }

  export type DesignWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DesignWhereInput | DesignWhereInput[]
    OR?: DesignWhereInput[]
    NOT?: DesignWhereInput | DesignWhereInput[]
    userId?: UuidFilter<"Design"> | string
    inputPrompt?: StringFilter<"Design"> | string
    uploadedImageUrl?: StringNullableFilter<"Design"> | string | null
    aiModelUsed?: StringFilter<"Design"> | string
    status?: EnumDesignStatusFilter<"Design"> | $Enums.DesignStatus
    createdAt?: DateTimeFilter<"Design"> | Date | string
    updatedAt?: DateTimeFilter<"Design"> | Date | string
    designOutputs?: DesignOutputListRelationFilter
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    feedback?: FeedbackListRelationFilter
    preferences?: XOR<PreferencesNullableScalarRelationFilter, PreferencesWhereInput> | null
    roiCalculation?: XOR<RoiCalculationNullableScalarRelationFilter, RoiCalculationWhereInput> | null
  }, "id">

  export type DesignOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    inputPrompt?: SortOrder
    uploadedImageUrl?: SortOrderInput | SortOrder
    aiModelUsed?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DesignCountOrderByAggregateInput
    _max?: DesignMaxOrderByAggregateInput
    _min?: DesignMinOrderByAggregateInput
  }

  export type DesignScalarWhereWithAggregatesInput = {
    AND?: DesignScalarWhereWithAggregatesInput | DesignScalarWhereWithAggregatesInput[]
    OR?: DesignScalarWhereWithAggregatesInput[]
    NOT?: DesignScalarWhereWithAggregatesInput | DesignScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Design"> | string
    userId?: UuidWithAggregatesFilter<"Design"> | string
    inputPrompt?: StringWithAggregatesFilter<"Design"> | string
    uploadedImageUrl?: StringNullableWithAggregatesFilter<"Design"> | string | null
    aiModelUsed?: StringWithAggregatesFilter<"Design"> | string
    status?: EnumDesignStatusWithAggregatesFilter<"Design"> | $Enums.DesignStatus
    createdAt?: DateTimeWithAggregatesFilter<"Design"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Design"> | Date | string
  }

  export type PreferencesWhereInput = {
    AND?: PreferencesWhereInput | PreferencesWhereInput[]
    OR?: PreferencesWhereInput[]
    NOT?: PreferencesWhereInput | PreferencesWhereInput[]
    id?: UuidFilter<"Preferences"> | string
    designId?: UuidFilter<"Preferences"> | string
    roomType?: StringFilter<"Preferences"> | string
    size?: StringFilter<"Preferences"> | string
    stylePreference?: StringFilter<"Preferences"> | string
    budget?: FloatNullableFilter<"Preferences"> | number | null
    colorScheme?: StringNullableFilter<"Preferences"> | string | null
    materialPreferences?: StringNullableFilter<"Preferences"> | string | null
    otherRequirements?: StringNullableFilter<"Preferences"> | string | null
    createdAt?: DateTimeFilter<"Preferences"> | Date | string
    updatedAt?: DateTimeFilter<"Preferences"> | Date | string
    design?: XOR<DesignScalarRelationFilter, DesignWhereInput>
  }

  export type PreferencesOrderByWithRelationInput = {
    id?: SortOrder
    designId?: SortOrder
    roomType?: SortOrder
    size?: SortOrder
    stylePreference?: SortOrder
    budget?: SortOrderInput | SortOrder
    colorScheme?: SortOrderInput | SortOrder
    materialPreferences?: SortOrderInput | SortOrder
    otherRequirements?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    design?: DesignOrderByWithRelationInput
  }

  export type PreferencesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    designId?: string
    AND?: PreferencesWhereInput | PreferencesWhereInput[]
    OR?: PreferencesWhereInput[]
    NOT?: PreferencesWhereInput | PreferencesWhereInput[]
    roomType?: StringFilter<"Preferences"> | string
    size?: StringFilter<"Preferences"> | string
    stylePreference?: StringFilter<"Preferences"> | string
    budget?: FloatNullableFilter<"Preferences"> | number | null
    colorScheme?: StringNullableFilter<"Preferences"> | string | null
    materialPreferences?: StringNullableFilter<"Preferences"> | string | null
    otherRequirements?: StringNullableFilter<"Preferences"> | string | null
    createdAt?: DateTimeFilter<"Preferences"> | Date | string
    updatedAt?: DateTimeFilter<"Preferences"> | Date | string
    design?: XOR<DesignScalarRelationFilter, DesignWhereInput>
  }, "id" | "designId">

  export type PreferencesOrderByWithAggregationInput = {
    id?: SortOrder
    designId?: SortOrder
    roomType?: SortOrder
    size?: SortOrder
    stylePreference?: SortOrder
    budget?: SortOrderInput | SortOrder
    colorScheme?: SortOrderInput | SortOrder
    materialPreferences?: SortOrderInput | SortOrder
    otherRequirements?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PreferencesCountOrderByAggregateInput
    _avg?: PreferencesAvgOrderByAggregateInput
    _max?: PreferencesMaxOrderByAggregateInput
    _min?: PreferencesMinOrderByAggregateInput
    _sum?: PreferencesSumOrderByAggregateInput
  }

  export type PreferencesScalarWhereWithAggregatesInput = {
    AND?: PreferencesScalarWhereWithAggregatesInput | PreferencesScalarWhereWithAggregatesInput[]
    OR?: PreferencesScalarWhereWithAggregatesInput[]
    NOT?: PreferencesScalarWhereWithAggregatesInput | PreferencesScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Preferences"> | string
    designId?: UuidWithAggregatesFilter<"Preferences"> | string
    roomType?: StringWithAggregatesFilter<"Preferences"> | string
    size?: StringWithAggregatesFilter<"Preferences"> | string
    stylePreference?: StringWithAggregatesFilter<"Preferences"> | string
    budget?: FloatNullableWithAggregatesFilter<"Preferences"> | number | null
    colorScheme?: StringNullableWithAggregatesFilter<"Preferences"> | string | null
    materialPreferences?: StringNullableWithAggregatesFilter<"Preferences"> | string | null
    otherRequirements?: StringNullableWithAggregatesFilter<"Preferences"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Preferences"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Preferences"> | Date | string
  }

  export type DesignOutputWhereInput = {
    AND?: DesignOutputWhereInput | DesignOutputWhereInput[]
    OR?: DesignOutputWhereInput[]
    NOT?: DesignOutputWhereInput | DesignOutputWhereInput[]
    id?: UuidFilter<"DesignOutput"> | string
    designId?: UuidFilter<"DesignOutput"> | string
    outputImageUrl?: StringFilter<"DesignOutput"> | string
    variationName?: StringNullableFilter<"DesignOutput"> | string | null
    generationParameters?: JsonNullableFilter<"DesignOutput">
    createdAt?: DateTimeFilter<"DesignOutput"> | Date | string
    design?: XOR<DesignScalarRelationFilter, DesignWhereInput>
  }

  export type DesignOutputOrderByWithRelationInput = {
    id?: SortOrder
    designId?: SortOrder
    outputImageUrl?: SortOrder
    variationName?: SortOrderInput | SortOrder
    generationParameters?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    design?: DesignOrderByWithRelationInput
  }

  export type DesignOutputWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DesignOutputWhereInput | DesignOutputWhereInput[]
    OR?: DesignOutputWhereInput[]
    NOT?: DesignOutputWhereInput | DesignOutputWhereInput[]
    designId?: UuidFilter<"DesignOutput"> | string
    outputImageUrl?: StringFilter<"DesignOutput"> | string
    variationName?: StringNullableFilter<"DesignOutput"> | string | null
    generationParameters?: JsonNullableFilter<"DesignOutput">
    createdAt?: DateTimeFilter<"DesignOutput"> | Date | string
    design?: XOR<DesignScalarRelationFilter, DesignWhereInput>
  }, "id">

  export type DesignOutputOrderByWithAggregationInput = {
    id?: SortOrder
    designId?: SortOrder
    outputImageUrl?: SortOrder
    variationName?: SortOrderInput | SortOrder
    generationParameters?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: DesignOutputCountOrderByAggregateInput
    _max?: DesignOutputMaxOrderByAggregateInput
    _min?: DesignOutputMinOrderByAggregateInput
  }

  export type DesignOutputScalarWhereWithAggregatesInput = {
    AND?: DesignOutputScalarWhereWithAggregatesInput | DesignOutputScalarWhereWithAggregatesInput[]
    OR?: DesignOutputScalarWhereWithAggregatesInput[]
    NOT?: DesignOutputScalarWhereWithAggregatesInput | DesignOutputScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"DesignOutput"> | string
    designId?: UuidWithAggregatesFilter<"DesignOutput"> | string
    outputImageUrl?: StringWithAggregatesFilter<"DesignOutput"> | string
    variationName?: StringNullableWithAggregatesFilter<"DesignOutput"> | string | null
    generationParameters?: JsonNullableWithAggregatesFilter<"DesignOutput">
    createdAt?: DateTimeWithAggregatesFilter<"DesignOutput"> | Date | string
  }

  export type RoiCalculationWhereInput = {
    AND?: RoiCalculationWhereInput | RoiCalculationWhereInput[]
    OR?: RoiCalculationWhereInput[]
    NOT?: RoiCalculationWhereInput | RoiCalculationWhereInput[]
    id?: UuidFilter<"RoiCalculation"> | string
    designId?: UuidFilter<"RoiCalculation"> | string
    estimatedCost?: FloatFilter<"RoiCalculation"> | number
    roiPercentage?: FloatFilter<"RoiCalculation"> | number
    paybackTimeline?: StringNullableFilter<"RoiCalculation"> | string | null
    costBreakdown?: JsonNullableFilter<"RoiCalculation">
    notes?: StringNullableFilter<"RoiCalculation"> | string | null
    createdAt?: DateTimeFilter<"RoiCalculation"> | Date | string
    updatedAt?: DateTimeFilter<"RoiCalculation"> | Date | string
    design?: XOR<DesignScalarRelationFilter, DesignWhereInput>
  }

  export type RoiCalculationOrderByWithRelationInput = {
    id?: SortOrder
    designId?: SortOrder
    estimatedCost?: SortOrder
    roiPercentage?: SortOrder
    paybackTimeline?: SortOrderInput | SortOrder
    costBreakdown?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    design?: DesignOrderByWithRelationInput
  }

  export type RoiCalculationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    designId?: string
    AND?: RoiCalculationWhereInput | RoiCalculationWhereInput[]
    OR?: RoiCalculationWhereInput[]
    NOT?: RoiCalculationWhereInput | RoiCalculationWhereInput[]
    estimatedCost?: FloatFilter<"RoiCalculation"> | number
    roiPercentage?: FloatFilter<"RoiCalculation"> | number
    paybackTimeline?: StringNullableFilter<"RoiCalculation"> | string | null
    costBreakdown?: JsonNullableFilter<"RoiCalculation">
    notes?: StringNullableFilter<"RoiCalculation"> | string | null
    createdAt?: DateTimeFilter<"RoiCalculation"> | Date | string
    updatedAt?: DateTimeFilter<"RoiCalculation"> | Date | string
    design?: XOR<DesignScalarRelationFilter, DesignWhereInput>
  }, "id" | "designId">

  export type RoiCalculationOrderByWithAggregationInput = {
    id?: SortOrder
    designId?: SortOrder
    estimatedCost?: SortOrder
    roiPercentage?: SortOrder
    paybackTimeline?: SortOrderInput | SortOrder
    costBreakdown?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RoiCalculationCountOrderByAggregateInput
    _avg?: RoiCalculationAvgOrderByAggregateInput
    _max?: RoiCalculationMaxOrderByAggregateInput
    _min?: RoiCalculationMinOrderByAggregateInput
    _sum?: RoiCalculationSumOrderByAggregateInput
  }

  export type RoiCalculationScalarWhereWithAggregatesInput = {
    AND?: RoiCalculationScalarWhereWithAggregatesInput | RoiCalculationScalarWhereWithAggregatesInput[]
    OR?: RoiCalculationScalarWhereWithAggregatesInput[]
    NOT?: RoiCalculationScalarWhereWithAggregatesInput | RoiCalculationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"RoiCalculation"> | string
    designId?: UuidWithAggregatesFilter<"RoiCalculation"> | string
    estimatedCost?: FloatWithAggregatesFilter<"RoiCalculation"> | number
    roiPercentage?: FloatWithAggregatesFilter<"RoiCalculation"> | number
    paybackTimeline?: StringNullableWithAggregatesFilter<"RoiCalculation"> | string | null
    costBreakdown?: JsonNullableWithAggregatesFilter<"RoiCalculation">
    notes?: StringNullableWithAggregatesFilter<"RoiCalculation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"RoiCalculation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RoiCalculation"> | Date | string
  }

  export type FeedbackWhereInput = {
    AND?: FeedbackWhereInput | FeedbackWhereInput[]
    OR?: FeedbackWhereInput[]
    NOT?: FeedbackWhereInput | FeedbackWhereInput[]
    id?: UuidFilter<"Feedback"> | string
    designId?: UuidFilter<"Feedback"> | string
    userId?: UuidFilter<"Feedback"> | string
    rating?: IntFilter<"Feedback"> | number
    comments?: StringNullableFilter<"Feedback"> | string | null
    type?: EnumFeedbackTypeFilter<"Feedback"> | $Enums.FeedbackType
    helpful?: BoolNullableFilter<"Feedback"> | boolean | null
    metadata?: JsonNullableFilter<"Feedback">
    createdAt?: DateTimeFilter<"Feedback"> | Date | string
    updatedAt?: DateTimeFilter<"Feedback"> | Date | string
    design?: XOR<DesignScalarRelationFilter, DesignWhereInput>
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }

  export type FeedbackOrderByWithRelationInput = {
    id?: SortOrder
    designId?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    comments?: SortOrderInput | SortOrder
    type?: SortOrder
    helpful?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    design?: DesignOrderByWithRelationInput
    profile?: ProfileOrderByWithRelationInput
  }

  export type FeedbackWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FeedbackWhereInput | FeedbackWhereInput[]
    OR?: FeedbackWhereInput[]
    NOT?: FeedbackWhereInput | FeedbackWhereInput[]
    designId?: UuidFilter<"Feedback"> | string
    userId?: UuidFilter<"Feedback"> | string
    rating?: IntFilter<"Feedback"> | number
    comments?: StringNullableFilter<"Feedback"> | string | null
    type?: EnumFeedbackTypeFilter<"Feedback"> | $Enums.FeedbackType
    helpful?: BoolNullableFilter<"Feedback"> | boolean | null
    metadata?: JsonNullableFilter<"Feedback">
    createdAt?: DateTimeFilter<"Feedback"> | Date | string
    updatedAt?: DateTimeFilter<"Feedback"> | Date | string
    design?: XOR<DesignScalarRelationFilter, DesignWhereInput>
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }, "id">

  export type FeedbackOrderByWithAggregationInput = {
    id?: SortOrder
    designId?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    comments?: SortOrderInput | SortOrder
    type?: SortOrder
    helpful?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FeedbackCountOrderByAggregateInput
    _avg?: FeedbackAvgOrderByAggregateInput
    _max?: FeedbackMaxOrderByAggregateInput
    _min?: FeedbackMinOrderByAggregateInput
    _sum?: FeedbackSumOrderByAggregateInput
  }

  export type FeedbackScalarWhereWithAggregatesInput = {
    AND?: FeedbackScalarWhereWithAggregatesInput | FeedbackScalarWhereWithAggregatesInput[]
    OR?: FeedbackScalarWhereWithAggregatesInput[]
    NOT?: FeedbackScalarWhereWithAggregatesInput | FeedbackScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Feedback"> | string
    designId?: UuidWithAggregatesFilter<"Feedback"> | string
    userId?: UuidWithAggregatesFilter<"Feedback"> | string
    rating?: IntWithAggregatesFilter<"Feedback"> | number
    comments?: StringNullableWithAggregatesFilter<"Feedback"> | string | null
    type?: EnumFeedbackTypeWithAggregatesFilter<"Feedback"> | $Enums.FeedbackType
    helpful?: BoolNullableWithAggregatesFilter<"Feedback"> | boolean | null
    metadata?: JsonNullableWithAggregatesFilter<"Feedback">
    createdAt?: DateTimeWithAggregatesFilter<"Feedback"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Feedback"> | Date | string
  }

  export type ProfileCreateInput = {
    id?: string
    userId: string
    name?: string | null
    company?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    designs?: DesignCreateNestedManyWithoutProfileInput
    feedback?: FeedbackCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateInput = {
    id?: string
    userId: string
    name?: string | null
    company?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    designs?: DesignUncheckedCreateNestedManyWithoutProfileInput
    feedback?: FeedbackUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    designs?: DesignUpdateManyWithoutProfileNestedInput
    feedback?: FeedbackUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    designs?: DesignUncheckedUpdateManyWithoutProfileNestedInput
    feedback?: FeedbackUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type ProfileCreateManyInput = {
    id?: string
    userId: string
    name?: string | null
    company?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DesignCreateInput = {
    id?: string
    inputPrompt: string
    uploadedImageUrl?: string | null
    aiModelUsed: string
    status?: $Enums.DesignStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    designOutputs?: DesignOutputCreateNestedManyWithoutDesignInput
    profile: ProfileCreateNestedOneWithoutDesignsInput
    feedback?: FeedbackCreateNestedManyWithoutDesignInput
    preferences?: PreferencesCreateNestedOneWithoutDesignInput
    roiCalculation?: RoiCalculationCreateNestedOneWithoutDesignInput
  }

  export type DesignUncheckedCreateInput = {
    id?: string
    userId: string
    inputPrompt: string
    uploadedImageUrl?: string | null
    aiModelUsed: string
    status?: $Enums.DesignStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    designOutputs?: DesignOutputUncheckedCreateNestedManyWithoutDesignInput
    feedback?: FeedbackUncheckedCreateNestedManyWithoutDesignInput
    preferences?: PreferencesUncheckedCreateNestedOneWithoutDesignInput
    roiCalculation?: RoiCalculationUncheckedCreateNestedOneWithoutDesignInput
  }

  export type DesignUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    inputPrompt?: StringFieldUpdateOperationsInput | string
    uploadedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiModelUsed?: StringFieldUpdateOperationsInput | string
    status?: EnumDesignStatusFieldUpdateOperationsInput | $Enums.DesignStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    designOutputs?: DesignOutputUpdateManyWithoutDesignNestedInput
    profile?: ProfileUpdateOneRequiredWithoutDesignsNestedInput
    feedback?: FeedbackUpdateManyWithoutDesignNestedInput
    preferences?: PreferencesUpdateOneWithoutDesignNestedInput
    roiCalculation?: RoiCalculationUpdateOneWithoutDesignNestedInput
  }

  export type DesignUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    inputPrompt?: StringFieldUpdateOperationsInput | string
    uploadedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiModelUsed?: StringFieldUpdateOperationsInput | string
    status?: EnumDesignStatusFieldUpdateOperationsInput | $Enums.DesignStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    designOutputs?: DesignOutputUncheckedUpdateManyWithoutDesignNestedInput
    feedback?: FeedbackUncheckedUpdateManyWithoutDesignNestedInput
    preferences?: PreferencesUncheckedUpdateOneWithoutDesignNestedInput
    roiCalculation?: RoiCalculationUncheckedUpdateOneWithoutDesignNestedInput
  }

  export type DesignCreateManyInput = {
    id?: string
    userId: string
    inputPrompt: string
    uploadedImageUrl?: string | null
    aiModelUsed: string
    status?: $Enums.DesignStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DesignUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    inputPrompt?: StringFieldUpdateOperationsInput | string
    uploadedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiModelUsed?: StringFieldUpdateOperationsInput | string
    status?: EnumDesignStatusFieldUpdateOperationsInput | $Enums.DesignStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DesignUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    inputPrompt?: StringFieldUpdateOperationsInput | string
    uploadedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiModelUsed?: StringFieldUpdateOperationsInput | string
    status?: EnumDesignStatusFieldUpdateOperationsInput | $Enums.DesignStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PreferencesCreateInput = {
    id?: string
    roomType: string
    size: string
    stylePreference: string
    budget?: number | null
    colorScheme?: string | null
    materialPreferences?: string | null
    otherRequirements?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    design: DesignCreateNestedOneWithoutPreferencesInput
  }

  export type PreferencesUncheckedCreateInput = {
    id?: string
    designId: string
    roomType: string
    size: string
    stylePreference: string
    budget?: number | null
    colorScheme?: string | null
    materialPreferences?: string | null
    otherRequirements?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PreferencesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomType?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    stylePreference?: StringFieldUpdateOperationsInput | string
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    colorScheme?: NullableStringFieldUpdateOperationsInput | string | null
    materialPreferences?: NullableStringFieldUpdateOperationsInput | string | null
    otherRequirements?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    design?: DesignUpdateOneRequiredWithoutPreferencesNestedInput
  }

  export type PreferencesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    designId?: StringFieldUpdateOperationsInput | string
    roomType?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    stylePreference?: StringFieldUpdateOperationsInput | string
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    colorScheme?: NullableStringFieldUpdateOperationsInput | string | null
    materialPreferences?: NullableStringFieldUpdateOperationsInput | string | null
    otherRequirements?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PreferencesCreateManyInput = {
    id?: string
    designId: string
    roomType: string
    size: string
    stylePreference: string
    budget?: number | null
    colorScheme?: string | null
    materialPreferences?: string | null
    otherRequirements?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PreferencesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomType?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    stylePreference?: StringFieldUpdateOperationsInput | string
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    colorScheme?: NullableStringFieldUpdateOperationsInput | string | null
    materialPreferences?: NullableStringFieldUpdateOperationsInput | string | null
    otherRequirements?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PreferencesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    designId?: StringFieldUpdateOperationsInput | string
    roomType?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    stylePreference?: StringFieldUpdateOperationsInput | string
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    colorScheme?: NullableStringFieldUpdateOperationsInput | string | null
    materialPreferences?: NullableStringFieldUpdateOperationsInput | string | null
    otherRequirements?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DesignOutputCreateInput = {
    id?: string
    outputImageUrl: string
    variationName?: string | null
    generationParameters?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    design: DesignCreateNestedOneWithoutDesignOutputsInput
  }

  export type DesignOutputUncheckedCreateInput = {
    id?: string
    designId: string
    outputImageUrl: string
    variationName?: string | null
    generationParameters?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type DesignOutputUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    outputImageUrl?: StringFieldUpdateOperationsInput | string
    variationName?: NullableStringFieldUpdateOperationsInput | string | null
    generationParameters?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    design?: DesignUpdateOneRequiredWithoutDesignOutputsNestedInput
  }

  export type DesignOutputUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    designId?: StringFieldUpdateOperationsInput | string
    outputImageUrl?: StringFieldUpdateOperationsInput | string
    variationName?: NullableStringFieldUpdateOperationsInput | string | null
    generationParameters?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DesignOutputCreateManyInput = {
    id?: string
    designId: string
    outputImageUrl: string
    variationName?: string | null
    generationParameters?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type DesignOutputUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    outputImageUrl?: StringFieldUpdateOperationsInput | string
    variationName?: NullableStringFieldUpdateOperationsInput | string | null
    generationParameters?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DesignOutputUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    designId?: StringFieldUpdateOperationsInput | string
    outputImageUrl?: StringFieldUpdateOperationsInput | string
    variationName?: NullableStringFieldUpdateOperationsInput | string | null
    generationParameters?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoiCalculationCreateInput = {
    id?: string
    estimatedCost: number
    roiPercentage: number
    paybackTimeline?: string | null
    costBreakdown?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    design: DesignCreateNestedOneWithoutRoiCalculationInput
  }

  export type RoiCalculationUncheckedCreateInput = {
    id?: string
    designId: string
    estimatedCost: number
    roiPercentage: number
    paybackTimeline?: string | null
    costBreakdown?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoiCalculationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    estimatedCost?: FloatFieldUpdateOperationsInput | number
    roiPercentage?: FloatFieldUpdateOperationsInput | number
    paybackTimeline?: NullableStringFieldUpdateOperationsInput | string | null
    costBreakdown?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    design?: DesignUpdateOneRequiredWithoutRoiCalculationNestedInput
  }

  export type RoiCalculationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    designId?: StringFieldUpdateOperationsInput | string
    estimatedCost?: FloatFieldUpdateOperationsInput | number
    roiPercentage?: FloatFieldUpdateOperationsInput | number
    paybackTimeline?: NullableStringFieldUpdateOperationsInput | string | null
    costBreakdown?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoiCalculationCreateManyInput = {
    id?: string
    designId: string
    estimatedCost: number
    roiPercentage: number
    paybackTimeline?: string | null
    costBreakdown?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoiCalculationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    estimatedCost?: FloatFieldUpdateOperationsInput | number
    roiPercentage?: FloatFieldUpdateOperationsInput | number
    paybackTimeline?: NullableStringFieldUpdateOperationsInput | string | null
    costBreakdown?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoiCalculationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    designId?: StringFieldUpdateOperationsInput | string
    estimatedCost?: FloatFieldUpdateOperationsInput | number
    roiPercentage?: FloatFieldUpdateOperationsInput | number
    paybackTimeline?: NullableStringFieldUpdateOperationsInput | string | null
    costBreakdown?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackCreateInput = {
    id?: string
    rating: number
    comments?: string | null
    type?: $Enums.FeedbackType
    helpful?: boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    design: DesignCreateNestedOneWithoutFeedbackInput
    profile: ProfileCreateNestedOneWithoutFeedbackInput
  }

  export type FeedbackUncheckedCreateInput = {
    id?: string
    designId: string
    userId: string
    rating: number
    comments?: string | null
    type?: $Enums.FeedbackType
    helpful?: boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FeedbackUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumFeedbackTypeFieldUpdateOperationsInput | $Enums.FeedbackType
    helpful?: NullableBoolFieldUpdateOperationsInput | boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    design?: DesignUpdateOneRequiredWithoutFeedbackNestedInput
    profile?: ProfileUpdateOneRequiredWithoutFeedbackNestedInput
  }

  export type FeedbackUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    designId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumFeedbackTypeFieldUpdateOperationsInput | $Enums.FeedbackType
    helpful?: NullableBoolFieldUpdateOperationsInput | boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackCreateManyInput = {
    id?: string
    designId: string
    userId: string
    rating: number
    comments?: string | null
    type?: $Enums.FeedbackType
    helpful?: boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FeedbackUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumFeedbackTypeFieldUpdateOperationsInput | $Enums.FeedbackType
    helpful?: NullableBoolFieldUpdateOperationsInput | boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    designId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumFeedbackTypeFieldUpdateOperationsInput | $Enums.FeedbackType
    helpful?: NullableBoolFieldUpdateOperationsInput | boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DesignListRelationFilter = {
    every?: DesignWhereInput
    some?: DesignWhereInput
    none?: DesignWhereInput
  }

  export type FeedbackListRelationFilter = {
    every?: FeedbackWhereInput
    some?: FeedbackWhereInput
    none?: FeedbackWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DesignOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FeedbackOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    company?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    company?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    company?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumDesignStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DesignStatus | EnumDesignStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DesignStatus[] | ListEnumDesignStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DesignStatus[] | ListEnumDesignStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDesignStatusFilter<$PrismaModel> | $Enums.DesignStatus
  }

  export type DesignOutputListRelationFilter = {
    every?: DesignOutputWhereInput
    some?: DesignOutputWhereInput
    none?: DesignOutputWhereInput
  }

  export type ProfileScalarRelationFilter = {
    is?: ProfileWhereInput
    isNot?: ProfileWhereInput
  }

  export type PreferencesNullableScalarRelationFilter = {
    is?: PreferencesWhereInput | null
    isNot?: PreferencesWhereInput | null
  }

  export type RoiCalculationNullableScalarRelationFilter = {
    is?: RoiCalculationWhereInput | null
    isNot?: RoiCalculationWhereInput | null
  }

  export type DesignOutputOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DesignCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    inputPrompt?: SortOrder
    uploadedImageUrl?: SortOrder
    aiModelUsed?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DesignMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    inputPrompt?: SortOrder
    uploadedImageUrl?: SortOrder
    aiModelUsed?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DesignMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    inputPrompt?: SortOrder
    uploadedImageUrl?: SortOrder
    aiModelUsed?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumDesignStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DesignStatus | EnumDesignStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DesignStatus[] | ListEnumDesignStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DesignStatus[] | ListEnumDesignStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDesignStatusWithAggregatesFilter<$PrismaModel> | $Enums.DesignStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDesignStatusFilter<$PrismaModel>
    _max?: NestedEnumDesignStatusFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type DesignScalarRelationFilter = {
    is?: DesignWhereInput
    isNot?: DesignWhereInput
  }

  export type PreferencesCountOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    roomType?: SortOrder
    size?: SortOrder
    stylePreference?: SortOrder
    budget?: SortOrder
    colorScheme?: SortOrder
    materialPreferences?: SortOrder
    otherRequirements?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PreferencesAvgOrderByAggregateInput = {
    budget?: SortOrder
  }

  export type PreferencesMaxOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    roomType?: SortOrder
    size?: SortOrder
    stylePreference?: SortOrder
    budget?: SortOrder
    colorScheme?: SortOrder
    materialPreferences?: SortOrder
    otherRequirements?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PreferencesMinOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    roomType?: SortOrder
    size?: SortOrder
    stylePreference?: SortOrder
    budget?: SortOrder
    colorScheme?: SortOrder
    materialPreferences?: SortOrder
    otherRequirements?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PreferencesSumOrderByAggregateInput = {
    budget?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DesignOutputCountOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    outputImageUrl?: SortOrder
    variationName?: SortOrder
    generationParameters?: SortOrder
    createdAt?: SortOrder
  }

  export type DesignOutputMaxOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    outputImageUrl?: SortOrder
    variationName?: SortOrder
    createdAt?: SortOrder
  }

  export type DesignOutputMinOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    outputImageUrl?: SortOrder
    variationName?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type RoiCalculationCountOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    estimatedCost?: SortOrder
    roiPercentage?: SortOrder
    paybackTimeline?: SortOrder
    costBreakdown?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoiCalculationAvgOrderByAggregateInput = {
    estimatedCost?: SortOrder
    roiPercentage?: SortOrder
  }

  export type RoiCalculationMaxOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    estimatedCost?: SortOrder
    roiPercentage?: SortOrder
    paybackTimeline?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoiCalculationMinOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    estimatedCost?: SortOrder
    roiPercentage?: SortOrder
    paybackTimeline?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoiCalculationSumOrderByAggregateInput = {
    estimatedCost?: SortOrder
    roiPercentage?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumFeedbackTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FeedbackType | EnumFeedbackTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FeedbackType[] | ListEnumFeedbackTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FeedbackType[] | ListEnumFeedbackTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFeedbackTypeFilter<$PrismaModel> | $Enums.FeedbackType
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type FeedbackCountOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    comments?: SortOrder
    type?: SortOrder
    helpful?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FeedbackAvgOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type FeedbackMaxOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    comments?: SortOrder
    type?: SortOrder
    helpful?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FeedbackMinOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    comments?: SortOrder
    type?: SortOrder
    helpful?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FeedbackSumOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumFeedbackTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FeedbackType | EnumFeedbackTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FeedbackType[] | ListEnumFeedbackTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FeedbackType[] | ListEnumFeedbackTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFeedbackTypeWithAggregatesFilter<$PrismaModel> | $Enums.FeedbackType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFeedbackTypeFilter<$PrismaModel>
    _max?: NestedEnumFeedbackTypeFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type DesignCreateNestedManyWithoutProfileInput = {
    create?: XOR<DesignCreateWithoutProfileInput, DesignUncheckedCreateWithoutProfileInput> | DesignCreateWithoutProfileInput[] | DesignUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: DesignCreateOrConnectWithoutProfileInput | DesignCreateOrConnectWithoutProfileInput[]
    createMany?: DesignCreateManyProfileInputEnvelope
    connect?: DesignWhereUniqueInput | DesignWhereUniqueInput[]
  }

  export type FeedbackCreateNestedManyWithoutProfileInput = {
    create?: XOR<FeedbackCreateWithoutProfileInput, FeedbackUncheckedCreateWithoutProfileInput> | FeedbackCreateWithoutProfileInput[] | FeedbackUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: FeedbackCreateOrConnectWithoutProfileInput | FeedbackCreateOrConnectWithoutProfileInput[]
    createMany?: FeedbackCreateManyProfileInputEnvelope
    connect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
  }

  export type DesignUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<DesignCreateWithoutProfileInput, DesignUncheckedCreateWithoutProfileInput> | DesignCreateWithoutProfileInput[] | DesignUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: DesignCreateOrConnectWithoutProfileInput | DesignCreateOrConnectWithoutProfileInput[]
    createMany?: DesignCreateManyProfileInputEnvelope
    connect?: DesignWhereUniqueInput | DesignWhereUniqueInput[]
  }

  export type FeedbackUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<FeedbackCreateWithoutProfileInput, FeedbackUncheckedCreateWithoutProfileInput> | FeedbackCreateWithoutProfileInput[] | FeedbackUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: FeedbackCreateOrConnectWithoutProfileInput | FeedbackCreateOrConnectWithoutProfileInput[]
    createMany?: FeedbackCreateManyProfileInputEnvelope
    connect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type DesignUpdateManyWithoutProfileNestedInput = {
    create?: XOR<DesignCreateWithoutProfileInput, DesignUncheckedCreateWithoutProfileInput> | DesignCreateWithoutProfileInput[] | DesignUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: DesignCreateOrConnectWithoutProfileInput | DesignCreateOrConnectWithoutProfileInput[]
    upsert?: DesignUpsertWithWhereUniqueWithoutProfileInput | DesignUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: DesignCreateManyProfileInputEnvelope
    set?: DesignWhereUniqueInput | DesignWhereUniqueInput[]
    disconnect?: DesignWhereUniqueInput | DesignWhereUniqueInput[]
    delete?: DesignWhereUniqueInput | DesignWhereUniqueInput[]
    connect?: DesignWhereUniqueInput | DesignWhereUniqueInput[]
    update?: DesignUpdateWithWhereUniqueWithoutProfileInput | DesignUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: DesignUpdateManyWithWhereWithoutProfileInput | DesignUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: DesignScalarWhereInput | DesignScalarWhereInput[]
  }

  export type FeedbackUpdateManyWithoutProfileNestedInput = {
    create?: XOR<FeedbackCreateWithoutProfileInput, FeedbackUncheckedCreateWithoutProfileInput> | FeedbackCreateWithoutProfileInput[] | FeedbackUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: FeedbackCreateOrConnectWithoutProfileInput | FeedbackCreateOrConnectWithoutProfileInput[]
    upsert?: FeedbackUpsertWithWhereUniqueWithoutProfileInput | FeedbackUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: FeedbackCreateManyProfileInputEnvelope
    set?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    disconnect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    delete?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    connect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    update?: FeedbackUpdateWithWhereUniqueWithoutProfileInput | FeedbackUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: FeedbackUpdateManyWithWhereWithoutProfileInput | FeedbackUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: FeedbackScalarWhereInput | FeedbackScalarWhereInput[]
  }

  export type DesignUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<DesignCreateWithoutProfileInput, DesignUncheckedCreateWithoutProfileInput> | DesignCreateWithoutProfileInput[] | DesignUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: DesignCreateOrConnectWithoutProfileInput | DesignCreateOrConnectWithoutProfileInput[]
    upsert?: DesignUpsertWithWhereUniqueWithoutProfileInput | DesignUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: DesignCreateManyProfileInputEnvelope
    set?: DesignWhereUniqueInput | DesignWhereUniqueInput[]
    disconnect?: DesignWhereUniqueInput | DesignWhereUniqueInput[]
    delete?: DesignWhereUniqueInput | DesignWhereUniqueInput[]
    connect?: DesignWhereUniqueInput | DesignWhereUniqueInput[]
    update?: DesignUpdateWithWhereUniqueWithoutProfileInput | DesignUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: DesignUpdateManyWithWhereWithoutProfileInput | DesignUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: DesignScalarWhereInput | DesignScalarWhereInput[]
  }

  export type FeedbackUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<FeedbackCreateWithoutProfileInput, FeedbackUncheckedCreateWithoutProfileInput> | FeedbackCreateWithoutProfileInput[] | FeedbackUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: FeedbackCreateOrConnectWithoutProfileInput | FeedbackCreateOrConnectWithoutProfileInput[]
    upsert?: FeedbackUpsertWithWhereUniqueWithoutProfileInput | FeedbackUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: FeedbackCreateManyProfileInputEnvelope
    set?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    disconnect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    delete?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    connect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    update?: FeedbackUpdateWithWhereUniqueWithoutProfileInput | FeedbackUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: FeedbackUpdateManyWithWhereWithoutProfileInput | FeedbackUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: FeedbackScalarWhereInput | FeedbackScalarWhereInput[]
  }

  export type DesignOutputCreateNestedManyWithoutDesignInput = {
    create?: XOR<DesignOutputCreateWithoutDesignInput, DesignOutputUncheckedCreateWithoutDesignInput> | DesignOutputCreateWithoutDesignInput[] | DesignOutputUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: DesignOutputCreateOrConnectWithoutDesignInput | DesignOutputCreateOrConnectWithoutDesignInput[]
    createMany?: DesignOutputCreateManyDesignInputEnvelope
    connect?: DesignOutputWhereUniqueInput | DesignOutputWhereUniqueInput[]
  }

  export type ProfileCreateNestedOneWithoutDesignsInput = {
    create?: XOR<ProfileCreateWithoutDesignsInput, ProfileUncheckedCreateWithoutDesignsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutDesignsInput
    connect?: ProfileWhereUniqueInput
  }

  export type FeedbackCreateNestedManyWithoutDesignInput = {
    create?: XOR<FeedbackCreateWithoutDesignInput, FeedbackUncheckedCreateWithoutDesignInput> | FeedbackCreateWithoutDesignInput[] | FeedbackUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: FeedbackCreateOrConnectWithoutDesignInput | FeedbackCreateOrConnectWithoutDesignInput[]
    createMany?: FeedbackCreateManyDesignInputEnvelope
    connect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
  }

  export type PreferencesCreateNestedOneWithoutDesignInput = {
    create?: XOR<PreferencesCreateWithoutDesignInput, PreferencesUncheckedCreateWithoutDesignInput>
    connectOrCreate?: PreferencesCreateOrConnectWithoutDesignInput
    connect?: PreferencesWhereUniqueInput
  }

  export type RoiCalculationCreateNestedOneWithoutDesignInput = {
    create?: XOR<RoiCalculationCreateWithoutDesignInput, RoiCalculationUncheckedCreateWithoutDesignInput>
    connectOrCreate?: RoiCalculationCreateOrConnectWithoutDesignInput
    connect?: RoiCalculationWhereUniqueInput
  }

  export type DesignOutputUncheckedCreateNestedManyWithoutDesignInput = {
    create?: XOR<DesignOutputCreateWithoutDesignInput, DesignOutputUncheckedCreateWithoutDesignInput> | DesignOutputCreateWithoutDesignInput[] | DesignOutputUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: DesignOutputCreateOrConnectWithoutDesignInput | DesignOutputCreateOrConnectWithoutDesignInput[]
    createMany?: DesignOutputCreateManyDesignInputEnvelope
    connect?: DesignOutputWhereUniqueInput | DesignOutputWhereUniqueInput[]
  }

  export type FeedbackUncheckedCreateNestedManyWithoutDesignInput = {
    create?: XOR<FeedbackCreateWithoutDesignInput, FeedbackUncheckedCreateWithoutDesignInput> | FeedbackCreateWithoutDesignInput[] | FeedbackUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: FeedbackCreateOrConnectWithoutDesignInput | FeedbackCreateOrConnectWithoutDesignInput[]
    createMany?: FeedbackCreateManyDesignInputEnvelope
    connect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
  }

  export type PreferencesUncheckedCreateNestedOneWithoutDesignInput = {
    create?: XOR<PreferencesCreateWithoutDesignInput, PreferencesUncheckedCreateWithoutDesignInput>
    connectOrCreate?: PreferencesCreateOrConnectWithoutDesignInput
    connect?: PreferencesWhereUniqueInput
  }

  export type RoiCalculationUncheckedCreateNestedOneWithoutDesignInput = {
    create?: XOR<RoiCalculationCreateWithoutDesignInput, RoiCalculationUncheckedCreateWithoutDesignInput>
    connectOrCreate?: RoiCalculationCreateOrConnectWithoutDesignInput
    connect?: RoiCalculationWhereUniqueInput
  }

  export type EnumDesignStatusFieldUpdateOperationsInput = {
    set?: $Enums.DesignStatus
  }

  export type DesignOutputUpdateManyWithoutDesignNestedInput = {
    create?: XOR<DesignOutputCreateWithoutDesignInput, DesignOutputUncheckedCreateWithoutDesignInput> | DesignOutputCreateWithoutDesignInput[] | DesignOutputUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: DesignOutputCreateOrConnectWithoutDesignInput | DesignOutputCreateOrConnectWithoutDesignInput[]
    upsert?: DesignOutputUpsertWithWhereUniqueWithoutDesignInput | DesignOutputUpsertWithWhereUniqueWithoutDesignInput[]
    createMany?: DesignOutputCreateManyDesignInputEnvelope
    set?: DesignOutputWhereUniqueInput | DesignOutputWhereUniqueInput[]
    disconnect?: DesignOutputWhereUniqueInput | DesignOutputWhereUniqueInput[]
    delete?: DesignOutputWhereUniqueInput | DesignOutputWhereUniqueInput[]
    connect?: DesignOutputWhereUniqueInput | DesignOutputWhereUniqueInput[]
    update?: DesignOutputUpdateWithWhereUniqueWithoutDesignInput | DesignOutputUpdateWithWhereUniqueWithoutDesignInput[]
    updateMany?: DesignOutputUpdateManyWithWhereWithoutDesignInput | DesignOutputUpdateManyWithWhereWithoutDesignInput[]
    deleteMany?: DesignOutputScalarWhereInput | DesignOutputScalarWhereInput[]
  }

  export type ProfileUpdateOneRequiredWithoutDesignsNestedInput = {
    create?: XOR<ProfileCreateWithoutDesignsInput, ProfileUncheckedCreateWithoutDesignsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutDesignsInput
    upsert?: ProfileUpsertWithoutDesignsInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutDesignsInput, ProfileUpdateWithoutDesignsInput>, ProfileUncheckedUpdateWithoutDesignsInput>
  }

  export type FeedbackUpdateManyWithoutDesignNestedInput = {
    create?: XOR<FeedbackCreateWithoutDesignInput, FeedbackUncheckedCreateWithoutDesignInput> | FeedbackCreateWithoutDesignInput[] | FeedbackUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: FeedbackCreateOrConnectWithoutDesignInput | FeedbackCreateOrConnectWithoutDesignInput[]
    upsert?: FeedbackUpsertWithWhereUniqueWithoutDesignInput | FeedbackUpsertWithWhereUniqueWithoutDesignInput[]
    createMany?: FeedbackCreateManyDesignInputEnvelope
    set?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    disconnect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    delete?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    connect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    update?: FeedbackUpdateWithWhereUniqueWithoutDesignInput | FeedbackUpdateWithWhereUniqueWithoutDesignInput[]
    updateMany?: FeedbackUpdateManyWithWhereWithoutDesignInput | FeedbackUpdateManyWithWhereWithoutDesignInput[]
    deleteMany?: FeedbackScalarWhereInput | FeedbackScalarWhereInput[]
  }

  export type PreferencesUpdateOneWithoutDesignNestedInput = {
    create?: XOR<PreferencesCreateWithoutDesignInput, PreferencesUncheckedCreateWithoutDesignInput>
    connectOrCreate?: PreferencesCreateOrConnectWithoutDesignInput
    upsert?: PreferencesUpsertWithoutDesignInput
    disconnect?: PreferencesWhereInput | boolean
    delete?: PreferencesWhereInput | boolean
    connect?: PreferencesWhereUniqueInput
    update?: XOR<XOR<PreferencesUpdateToOneWithWhereWithoutDesignInput, PreferencesUpdateWithoutDesignInput>, PreferencesUncheckedUpdateWithoutDesignInput>
  }

  export type RoiCalculationUpdateOneWithoutDesignNestedInput = {
    create?: XOR<RoiCalculationCreateWithoutDesignInput, RoiCalculationUncheckedCreateWithoutDesignInput>
    connectOrCreate?: RoiCalculationCreateOrConnectWithoutDesignInput
    upsert?: RoiCalculationUpsertWithoutDesignInput
    disconnect?: RoiCalculationWhereInput | boolean
    delete?: RoiCalculationWhereInput | boolean
    connect?: RoiCalculationWhereUniqueInput
    update?: XOR<XOR<RoiCalculationUpdateToOneWithWhereWithoutDesignInput, RoiCalculationUpdateWithoutDesignInput>, RoiCalculationUncheckedUpdateWithoutDesignInput>
  }

  export type DesignOutputUncheckedUpdateManyWithoutDesignNestedInput = {
    create?: XOR<DesignOutputCreateWithoutDesignInput, DesignOutputUncheckedCreateWithoutDesignInput> | DesignOutputCreateWithoutDesignInput[] | DesignOutputUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: DesignOutputCreateOrConnectWithoutDesignInput | DesignOutputCreateOrConnectWithoutDesignInput[]
    upsert?: DesignOutputUpsertWithWhereUniqueWithoutDesignInput | DesignOutputUpsertWithWhereUniqueWithoutDesignInput[]
    createMany?: DesignOutputCreateManyDesignInputEnvelope
    set?: DesignOutputWhereUniqueInput | DesignOutputWhereUniqueInput[]
    disconnect?: DesignOutputWhereUniqueInput | DesignOutputWhereUniqueInput[]
    delete?: DesignOutputWhereUniqueInput | DesignOutputWhereUniqueInput[]
    connect?: DesignOutputWhereUniqueInput | DesignOutputWhereUniqueInput[]
    update?: DesignOutputUpdateWithWhereUniqueWithoutDesignInput | DesignOutputUpdateWithWhereUniqueWithoutDesignInput[]
    updateMany?: DesignOutputUpdateManyWithWhereWithoutDesignInput | DesignOutputUpdateManyWithWhereWithoutDesignInput[]
    deleteMany?: DesignOutputScalarWhereInput | DesignOutputScalarWhereInput[]
  }

  export type FeedbackUncheckedUpdateManyWithoutDesignNestedInput = {
    create?: XOR<FeedbackCreateWithoutDesignInput, FeedbackUncheckedCreateWithoutDesignInput> | FeedbackCreateWithoutDesignInput[] | FeedbackUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: FeedbackCreateOrConnectWithoutDesignInput | FeedbackCreateOrConnectWithoutDesignInput[]
    upsert?: FeedbackUpsertWithWhereUniqueWithoutDesignInput | FeedbackUpsertWithWhereUniqueWithoutDesignInput[]
    createMany?: FeedbackCreateManyDesignInputEnvelope
    set?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    disconnect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    delete?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    connect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    update?: FeedbackUpdateWithWhereUniqueWithoutDesignInput | FeedbackUpdateWithWhereUniqueWithoutDesignInput[]
    updateMany?: FeedbackUpdateManyWithWhereWithoutDesignInput | FeedbackUpdateManyWithWhereWithoutDesignInput[]
    deleteMany?: FeedbackScalarWhereInput | FeedbackScalarWhereInput[]
  }

  export type PreferencesUncheckedUpdateOneWithoutDesignNestedInput = {
    create?: XOR<PreferencesCreateWithoutDesignInput, PreferencesUncheckedCreateWithoutDesignInput>
    connectOrCreate?: PreferencesCreateOrConnectWithoutDesignInput
    upsert?: PreferencesUpsertWithoutDesignInput
    disconnect?: PreferencesWhereInput | boolean
    delete?: PreferencesWhereInput | boolean
    connect?: PreferencesWhereUniqueInput
    update?: XOR<XOR<PreferencesUpdateToOneWithWhereWithoutDesignInput, PreferencesUpdateWithoutDesignInput>, PreferencesUncheckedUpdateWithoutDesignInput>
  }

  export type RoiCalculationUncheckedUpdateOneWithoutDesignNestedInput = {
    create?: XOR<RoiCalculationCreateWithoutDesignInput, RoiCalculationUncheckedCreateWithoutDesignInput>
    connectOrCreate?: RoiCalculationCreateOrConnectWithoutDesignInput
    upsert?: RoiCalculationUpsertWithoutDesignInput
    disconnect?: RoiCalculationWhereInput | boolean
    delete?: RoiCalculationWhereInput | boolean
    connect?: RoiCalculationWhereUniqueInput
    update?: XOR<XOR<RoiCalculationUpdateToOneWithWhereWithoutDesignInput, RoiCalculationUpdateWithoutDesignInput>, RoiCalculationUncheckedUpdateWithoutDesignInput>
  }

  export type DesignCreateNestedOneWithoutPreferencesInput = {
    create?: XOR<DesignCreateWithoutPreferencesInput, DesignUncheckedCreateWithoutPreferencesInput>
    connectOrCreate?: DesignCreateOrConnectWithoutPreferencesInput
    connect?: DesignWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DesignUpdateOneRequiredWithoutPreferencesNestedInput = {
    create?: XOR<DesignCreateWithoutPreferencesInput, DesignUncheckedCreateWithoutPreferencesInput>
    connectOrCreate?: DesignCreateOrConnectWithoutPreferencesInput
    upsert?: DesignUpsertWithoutPreferencesInput
    connect?: DesignWhereUniqueInput
    update?: XOR<XOR<DesignUpdateToOneWithWhereWithoutPreferencesInput, DesignUpdateWithoutPreferencesInput>, DesignUncheckedUpdateWithoutPreferencesInput>
  }

  export type DesignCreateNestedOneWithoutDesignOutputsInput = {
    create?: XOR<DesignCreateWithoutDesignOutputsInput, DesignUncheckedCreateWithoutDesignOutputsInput>
    connectOrCreate?: DesignCreateOrConnectWithoutDesignOutputsInput
    connect?: DesignWhereUniqueInput
  }

  export type DesignUpdateOneRequiredWithoutDesignOutputsNestedInput = {
    create?: XOR<DesignCreateWithoutDesignOutputsInput, DesignUncheckedCreateWithoutDesignOutputsInput>
    connectOrCreate?: DesignCreateOrConnectWithoutDesignOutputsInput
    upsert?: DesignUpsertWithoutDesignOutputsInput
    connect?: DesignWhereUniqueInput
    update?: XOR<XOR<DesignUpdateToOneWithWhereWithoutDesignOutputsInput, DesignUpdateWithoutDesignOutputsInput>, DesignUncheckedUpdateWithoutDesignOutputsInput>
  }

  export type DesignCreateNestedOneWithoutRoiCalculationInput = {
    create?: XOR<DesignCreateWithoutRoiCalculationInput, DesignUncheckedCreateWithoutRoiCalculationInput>
    connectOrCreate?: DesignCreateOrConnectWithoutRoiCalculationInput
    connect?: DesignWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DesignUpdateOneRequiredWithoutRoiCalculationNestedInput = {
    create?: XOR<DesignCreateWithoutRoiCalculationInput, DesignUncheckedCreateWithoutRoiCalculationInput>
    connectOrCreate?: DesignCreateOrConnectWithoutRoiCalculationInput
    upsert?: DesignUpsertWithoutRoiCalculationInput
    connect?: DesignWhereUniqueInput
    update?: XOR<XOR<DesignUpdateToOneWithWhereWithoutRoiCalculationInput, DesignUpdateWithoutRoiCalculationInput>, DesignUncheckedUpdateWithoutRoiCalculationInput>
  }

  export type DesignCreateNestedOneWithoutFeedbackInput = {
    create?: XOR<DesignCreateWithoutFeedbackInput, DesignUncheckedCreateWithoutFeedbackInput>
    connectOrCreate?: DesignCreateOrConnectWithoutFeedbackInput
    connect?: DesignWhereUniqueInput
  }

  export type ProfileCreateNestedOneWithoutFeedbackInput = {
    create?: XOR<ProfileCreateWithoutFeedbackInput, ProfileUncheckedCreateWithoutFeedbackInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutFeedbackInput
    connect?: ProfileWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumFeedbackTypeFieldUpdateOperationsInput = {
    set?: $Enums.FeedbackType
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type DesignUpdateOneRequiredWithoutFeedbackNestedInput = {
    create?: XOR<DesignCreateWithoutFeedbackInput, DesignUncheckedCreateWithoutFeedbackInput>
    connectOrCreate?: DesignCreateOrConnectWithoutFeedbackInput
    upsert?: DesignUpsertWithoutFeedbackInput
    connect?: DesignWhereUniqueInput
    update?: XOR<XOR<DesignUpdateToOneWithWhereWithoutFeedbackInput, DesignUpdateWithoutFeedbackInput>, DesignUncheckedUpdateWithoutFeedbackInput>
  }

  export type ProfileUpdateOneRequiredWithoutFeedbackNestedInput = {
    create?: XOR<ProfileCreateWithoutFeedbackInput, ProfileUncheckedCreateWithoutFeedbackInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutFeedbackInput
    upsert?: ProfileUpsertWithoutFeedbackInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutFeedbackInput, ProfileUpdateWithoutFeedbackInput>, ProfileUncheckedUpdateWithoutFeedbackInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumDesignStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DesignStatus | EnumDesignStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DesignStatus[] | ListEnumDesignStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DesignStatus[] | ListEnumDesignStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDesignStatusFilter<$PrismaModel> | $Enums.DesignStatus
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumDesignStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DesignStatus | EnumDesignStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DesignStatus[] | ListEnumDesignStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DesignStatus[] | ListEnumDesignStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDesignStatusWithAggregatesFilter<$PrismaModel> | $Enums.DesignStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDesignStatusFilter<$PrismaModel>
    _max?: NestedEnumDesignStatusFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumFeedbackTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FeedbackType | EnumFeedbackTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FeedbackType[] | ListEnumFeedbackTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FeedbackType[] | ListEnumFeedbackTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFeedbackTypeFilter<$PrismaModel> | $Enums.FeedbackType
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedEnumFeedbackTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FeedbackType | EnumFeedbackTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FeedbackType[] | ListEnumFeedbackTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FeedbackType[] | ListEnumFeedbackTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFeedbackTypeWithAggregatesFilter<$PrismaModel> | $Enums.FeedbackType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFeedbackTypeFilter<$PrismaModel>
    _max?: NestedEnumFeedbackTypeFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type DesignCreateWithoutProfileInput = {
    id?: string
    inputPrompt: string
    uploadedImageUrl?: string | null
    aiModelUsed: string
    status?: $Enums.DesignStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    designOutputs?: DesignOutputCreateNestedManyWithoutDesignInput
    feedback?: FeedbackCreateNestedManyWithoutDesignInput
    preferences?: PreferencesCreateNestedOneWithoutDesignInput
    roiCalculation?: RoiCalculationCreateNestedOneWithoutDesignInput
  }

  export type DesignUncheckedCreateWithoutProfileInput = {
    id?: string
    inputPrompt: string
    uploadedImageUrl?: string | null
    aiModelUsed: string
    status?: $Enums.DesignStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    designOutputs?: DesignOutputUncheckedCreateNestedManyWithoutDesignInput
    feedback?: FeedbackUncheckedCreateNestedManyWithoutDesignInput
    preferences?: PreferencesUncheckedCreateNestedOneWithoutDesignInput
    roiCalculation?: RoiCalculationUncheckedCreateNestedOneWithoutDesignInput
  }

  export type DesignCreateOrConnectWithoutProfileInput = {
    where: DesignWhereUniqueInput
    create: XOR<DesignCreateWithoutProfileInput, DesignUncheckedCreateWithoutProfileInput>
  }

  export type DesignCreateManyProfileInputEnvelope = {
    data: DesignCreateManyProfileInput | DesignCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type FeedbackCreateWithoutProfileInput = {
    id?: string
    rating: number
    comments?: string | null
    type?: $Enums.FeedbackType
    helpful?: boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    design: DesignCreateNestedOneWithoutFeedbackInput
  }

  export type FeedbackUncheckedCreateWithoutProfileInput = {
    id?: string
    designId: string
    rating: number
    comments?: string | null
    type?: $Enums.FeedbackType
    helpful?: boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FeedbackCreateOrConnectWithoutProfileInput = {
    where: FeedbackWhereUniqueInput
    create: XOR<FeedbackCreateWithoutProfileInput, FeedbackUncheckedCreateWithoutProfileInput>
  }

  export type FeedbackCreateManyProfileInputEnvelope = {
    data: FeedbackCreateManyProfileInput | FeedbackCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type DesignUpsertWithWhereUniqueWithoutProfileInput = {
    where: DesignWhereUniqueInput
    update: XOR<DesignUpdateWithoutProfileInput, DesignUncheckedUpdateWithoutProfileInput>
    create: XOR<DesignCreateWithoutProfileInput, DesignUncheckedCreateWithoutProfileInput>
  }

  export type DesignUpdateWithWhereUniqueWithoutProfileInput = {
    where: DesignWhereUniqueInput
    data: XOR<DesignUpdateWithoutProfileInput, DesignUncheckedUpdateWithoutProfileInput>
  }

  export type DesignUpdateManyWithWhereWithoutProfileInput = {
    where: DesignScalarWhereInput
    data: XOR<DesignUpdateManyMutationInput, DesignUncheckedUpdateManyWithoutProfileInput>
  }

  export type DesignScalarWhereInput = {
    AND?: DesignScalarWhereInput | DesignScalarWhereInput[]
    OR?: DesignScalarWhereInput[]
    NOT?: DesignScalarWhereInput | DesignScalarWhereInput[]
    id?: UuidFilter<"Design"> | string
    userId?: UuidFilter<"Design"> | string
    inputPrompt?: StringFilter<"Design"> | string
    uploadedImageUrl?: StringNullableFilter<"Design"> | string | null
    aiModelUsed?: StringFilter<"Design"> | string
    status?: EnumDesignStatusFilter<"Design"> | $Enums.DesignStatus
    createdAt?: DateTimeFilter<"Design"> | Date | string
    updatedAt?: DateTimeFilter<"Design"> | Date | string
  }

  export type FeedbackUpsertWithWhereUniqueWithoutProfileInput = {
    where: FeedbackWhereUniqueInput
    update: XOR<FeedbackUpdateWithoutProfileInput, FeedbackUncheckedUpdateWithoutProfileInput>
    create: XOR<FeedbackCreateWithoutProfileInput, FeedbackUncheckedCreateWithoutProfileInput>
  }

  export type FeedbackUpdateWithWhereUniqueWithoutProfileInput = {
    where: FeedbackWhereUniqueInput
    data: XOR<FeedbackUpdateWithoutProfileInput, FeedbackUncheckedUpdateWithoutProfileInput>
  }

  export type FeedbackUpdateManyWithWhereWithoutProfileInput = {
    where: FeedbackScalarWhereInput
    data: XOR<FeedbackUpdateManyMutationInput, FeedbackUncheckedUpdateManyWithoutProfileInput>
  }

  export type FeedbackScalarWhereInput = {
    AND?: FeedbackScalarWhereInput | FeedbackScalarWhereInput[]
    OR?: FeedbackScalarWhereInput[]
    NOT?: FeedbackScalarWhereInput | FeedbackScalarWhereInput[]
    id?: UuidFilter<"Feedback"> | string
    designId?: UuidFilter<"Feedback"> | string
    userId?: UuidFilter<"Feedback"> | string
    rating?: IntFilter<"Feedback"> | number
    comments?: StringNullableFilter<"Feedback"> | string | null
    type?: EnumFeedbackTypeFilter<"Feedback"> | $Enums.FeedbackType
    helpful?: BoolNullableFilter<"Feedback"> | boolean | null
    metadata?: JsonNullableFilter<"Feedback">
    createdAt?: DateTimeFilter<"Feedback"> | Date | string
    updatedAt?: DateTimeFilter<"Feedback"> | Date | string
  }

  export type DesignOutputCreateWithoutDesignInput = {
    id?: string
    outputImageUrl: string
    variationName?: string | null
    generationParameters?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type DesignOutputUncheckedCreateWithoutDesignInput = {
    id?: string
    outputImageUrl: string
    variationName?: string | null
    generationParameters?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type DesignOutputCreateOrConnectWithoutDesignInput = {
    where: DesignOutputWhereUniqueInput
    create: XOR<DesignOutputCreateWithoutDesignInput, DesignOutputUncheckedCreateWithoutDesignInput>
  }

  export type DesignOutputCreateManyDesignInputEnvelope = {
    data: DesignOutputCreateManyDesignInput | DesignOutputCreateManyDesignInput[]
    skipDuplicates?: boolean
  }

  export type ProfileCreateWithoutDesignsInput = {
    id?: string
    userId: string
    name?: string | null
    company?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    feedback?: FeedbackCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutDesignsInput = {
    id?: string
    userId: string
    name?: string | null
    company?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    feedback?: FeedbackUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutDesignsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutDesignsInput, ProfileUncheckedCreateWithoutDesignsInput>
  }

  export type FeedbackCreateWithoutDesignInput = {
    id?: string
    rating: number
    comments?: string | null
    type?: $Enums.FeedbackType
    helpful?: boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutFeedbackInput
  }

  export type FeedbackUncheckedCreateWithoutDesignInput = {
    id?: string
    userId: string
    rating: number
    comments?: string | null
    type?: $Enums.FeedbackType
    helpful?: boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FeedbackCreateOrConnectWithoutDesignInput = {
    where: FeedbackWhereUniqueInput
    create: XOR<FeedbackCreateWithoutDesignInput, FeedbackUncheckedCreateWithoutDesignInput>
  }

  export type FeedbackCreateManyDesignInputEnvelope = {
    data: FeedbackCreateManyDesignInput | FeedbackCreateManyDesignInput[]
    skipDuplicates?: boolean
  }

  export type PreferencesCreateWithoutDesignInput = {
    id?: string
    roomType: string
    size: string
    stylePreference: string
    budget?: number | null
    colorScheme?: string | null
    materialPreferences?: string | null
    otherRequirements?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PreferencesUncheckedCreateWithoutDesignInput = {
    id?: string
    roomType: string
    size: string
    stylePreference: string
    budget?: number | null
    colorScheme?: string | null
    materialPreferences?: string | null
    otherRequirements?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PreferencesCreateOrConnectWithoutDesignInput = {
    where: PreferencesWhereUniqueInput
    create: XOR<PreferencesCreateWithoutDesignInput, PreferencesUncheckedCreateWithoutDesignInput>
  }

  export type RoiCalculationCreateWithoutDesignInput = {
    id?: string
    estimatedCost: number
    roiPercentage: number
    paybackTimeline?: string | null
    costBreakdown?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoiCalculationUncheckedCreateWithoutDesignInput = {
    id?: string
    estimatedCost: number
    roiPercentage: number
    paybackTimeline?: string | null
    costBreakdown?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoiCalculationCreateOrConnectWithoutDesignInput = {
    where: RoiCalculationWhereUniqueInput
    create: XOR<RoiCalculationCreateWithoutDesignInput, RoiCalculationUncheckedCreateWithoutDesignInput>
  }

  export type DesignOutputUpsertWithWhereUniqueWithoutDesignInput = {
    where: DesignOutputWhereUniqueInput
    update: XOR<DesignOutputUpdateWithoutDesignInput, DesignOutputUncheckedUpdateWithoutDesignInput>
    create: XOR<DesignOutputCreateWithoutDesignInput, DesignOutputUncheckedCreateWithoutDesignInput>
  }

  export type DesignOutputUpdateWithWhereUniqueWithoutDesignInput = {
    where: DesignOutputWhereUniqueInput
    data: XOR<DesignOutputUpdateWithoutDesignInput, DesignOutputUncheckedUpdateWithoutDesignInput>
  }

  export type DesignOutputUpdateManyWithWhereWithoutDesignInput = {
    where: DesignOutputScalarWhereInput
    data: XOR<DesignOutputUpdateManyMutationInput, DesignOutputUncheckedUpdateManyWithoutDesignInput>
  }

  export type DesignOutputScalarWhereInput = {
    AND?: DesignOutputScalarWhereInput | DesignOutputScalarWhereInput[]
    OR?: DesignOutputScalarWhereInput[]
    NOT?: DesignOutputScalarWhereInput | DesignOutputScalarWhereInput[]
    id?: UuidFilter<"DesignOutput"> | string
    designId?: UuidFilter<"DesignOutput"> | string
    outputImageUrl?: StringFilter<"DesignOutput"> | string
    variationName?: StringNullableFilter<"DesignOutput"> | string | null
    generationParameters?: JsonNullableFilter<"DesignOutput">
    createdAt?: DateTimeFilter<"DesignOutput"> | Date | string
  }

  export type ProfileUpsertWithoutDesignsInput = {
    update: XOR<ProfileUpdateWithoutDesignsInput, ProfileUncheckedUpdateWithoutDesignsInput>
    create: XOR<ProfileCreateWithoutDesignsInput, ProfileUncheckedCreateWithoutDesignsInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutDesignsInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutDesignsInput, ProfileUncheckedUpdateWithoutDesignsInput>
  }

  export type ProfileUpdateWithoutDesignsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    feedback?: FeedbackUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutDesignsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    feedback?: FeedbackUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type FeedbackUpsertWithWhereUniqueWithoutDesignInput = {
    where: FeedbackWhereUniqueInput
    update: XOR<FeedbackUpdateWithoutDesignInput, FeedbackUncheckedUpdateWithoutDesignInput>
    create: XOR<FeedbackCreateWithoutDesignInput, FeedbackUncheckedCreateWithoutDesignInput>
  }

  export type FeedbackUpdateWithWhereUniqueWithoutDesignInput = {
    where: FeedbackWhereUniqueInput
    data: XOR<FeedbackUpdateWithoutDesignInput, FeedbackUncheckedUpdateWithoutDesignInput>
  }

  export type FeedbackUpdateManyWithWhereWithoutDesignInput = {
    where: FeedbackScalarWhereInput
    data: XOR<FeedbackUpdateManyMutationInput, FeedbackUncheckedUpdateManyWithoutDesignInput>
  }

  export type PreferencesUpsertWithoutDesignInput = {
    update: XOR<PreferencesUpdateWithoutDesignInput, PreferencesUncheckedUpdateWithoutDesignInput>
    create: XOR<PreferencesCreateWithoutDesignInput, PreferencesUncheckedCreateWithoutDesignInput>
    where?: PreferencesWhereInput
  }

  export type PreferencesUpdateToOneWithWhereWithoutDesignInput = {
    where?: PreferencesWhereInput
    data: XOR<PreferencesUpdateWithoutDesignInput, PreferencesUncheckedUpdateWithoutDesignInput>
  }

  export type PreferencesUpdateWithoutDesignInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomType?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    stylePreference?: StringFieldUpdateOperationsInput | string
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    colorScheme?: NullableStringFieldUpdateOperationsInput | string | null
    materialPreferences?: NullableStringFieldUpdateOperationsInput | string | null
    otherRequirements?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PreferencesUncheckedUpdateWithoutDesignInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomType?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    stylePreference?: StringFieldUpdateOperationsInput | string
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    colorScheme?: NullableStringFieldUpdateOperationsInput | string | null
    materialPreferences?: NullableStringFieldUpdateOperationsInput | string | null
    otherRequirements?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoiCalculationUpsertWithoutDesignInput = {
    update: XOR<RoiCalculationUpdateWithoutDesignInput, RoiCalculationUncheckedUpdateWithoutDesignInput>
    create: XOR<RoiCalculationCreateWithoutDesignInput, RoiCalculationUncheckedCreateWithoutDesignInput>
    where?: RoiCalculationWhereInput
  }

  export type RoiCalculationUpdateToOneWithWhereWithoutDesignInput = {
    where?: RoiCalculationWhereInput
    data: XOR<RoiCalculationUpdateWithoutDesignInput, RoiCalculationUncheckedUpdateWithoutDesignInput>
  }

  export type RoiCalculationUpdateWithoutDesignInput = {
    id?: StringFieldUpdateOperationsInput | string
    estimatedCost?: FloatFieldUpdateOperationsInput | number
    roiPercentage?: FloatFieldUpdateOperationsInput | number
    paybackTimeline?: NullableStringFieldUpdateOperationsInput | string | null
    costBreakdown?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoiCalculationUncheckedUpdateWithoutDesignInput = {
    id?: StringFieldUpdateOperationsInput | string
    estimatedCost?: FloatFieldUpdateOperationsInput | number
    roiPercentage?: FloatFieldUpdateOperationsInput | number
    paybackTimeline?: NullableStringFieldUpdateOperationsInput | string | null
    costBreakdown?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DesignCreateWithoutPreferencesInput = {
    id?: string
    inputPrompt: string
    uploadedImageUrl?: string | null
    aiModelUsed: string
    status?: $Enums.DesignStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    designOutputs?: DesignOutputCreateNestedManyWithoutDesignInput
    profile: ProfileCreateNestedOneWithoutDesignsInput
    feedback?: FeedbackCreateNestedManyWithoutDesignInput
    roiCalculation?: RoiCalculationCreateNestedOneWithoutDesignInput
  }

  export type DesignUncheckedCreateWithoutPreferencesInput = {
    id?: string
    userId: string
    inputPrompt: string
    uploadedImageUrl?: string | null
    aiModelUsed: string
    status?: $Enums.DesignStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    designOutputs?: DesignOutputUncheckedCreateNestedManyWithoutDesignInput
    feedback?: FeedbackUncheckedCreateNestedManyWithoutDesignInput
    roiCalculation?: RoiCalculationUncheckedCreateNestedOneWithoutDesignInput
  }

  export type DesignCreateOrConnectWithoutPreferencesInput = {
    where: DesignWhereUniqueInput
    create: XOR<DesignCreateWithoutPreferencesInput, DesignUncheckedCreateWithoutPreferencesInput>
  }

  export type DesignUpsertWithoutPreferencesInput = {
    update: XOR<DesignUpdateWithoutPreferencesInput, DesignUncheckedUpdateWithoutPreferencesInput>
    create: XOR<DesignCreateWithoutPreferencesInput, DesignUncheckedCreateWithoutPreferencesInput>
    where?: DesignWhereInput
  }

  export type DesignUpdateToOneWithWhereWithoutPreferencesInput = {
    where?: DesignWhereInput
    data: XOR<DesignUpdateWithoutPreferencesInput, DesignUncheckedUpdateWithoutPreferencesInput>
  }

  export type DesignUpdateWithoutPreferencesInput = {
    id?: StringFieldUpdateOperationsInput | string
    inputPrompt?: StringFieldUpdateOperationsInput | string
    uploadedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiModelUsed?: StringFieldUpdateOperationsInput | string
    status?: EnumDesignStatusFieldUpdateOperationsInput | $Enums.DesignStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    designOutputs?: DesignOutputUpdateManyWithoutDesignNestedInput
    profile?: ProfileUpdateOneRequiredWithoutDesignsNestedInput
    feedback?: FeedbackUpdateManyWithoutDesignNestedInput
    roiCalculation?: RoiCalculationUpdateOneWithoutDesignNestedInput
  }

  export type DesignUncheckedUpdateWithoutPreferencesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    inputPrompt?: StringFieldUpdateOperationsInput | string
    uploadedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiModelUsed?: StringFieldUpdateOperationsInput | string
    status?: EnumDesignStatusFieldUpdateOperationsInput | $Enums.DesignStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    designOutputs?: DesignOutputUncheckedUpdateManyWithoutDesignNestedInput
    feedback?: FeedbackUncheckedUpdateManyWithoutDesignNestedInput
    roiCalculation?: RoiCalculationUncheckedUpdateOneWithoutDesignNestedInput
  }

  export type DesignCreateWithoutDesignOutputsInput = {
    id?: string
    inputPrompt: string
    uploadedImageUrl?: string | null
    aiModelUsed: string
    status?: $Enums.DesignStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutDesignsInput
    feedback?: FeedbackCreateNestedManyWithoutDesignInput
    preferences?: PreferencesCreateNestedOneWithoutDesignInput
    roiCalculation?: RoiCalculationCreateNestedOneWithoutDesignInput
  }

  export type DesignUncheckedCreateWithoutDesignOutputsInput = {
    id?: string
    userId: string
    inputPrompt: string
    uploadedImageUrl?: string | null
    aiModelUsed: string
    status?: $Enums.DesignStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    feedback?: FeedbackUncheckedCreateNestedManyWithoutDesignInput
    preferences?: PreferencesUncheckedCreateNestedOneWithoutDesignInput
    roiCalculation?: RoiCalculationUncheckedCreateNestedOneWithoutDesignInput
  }

  export type DesignCreateOrConnectWithoutDesignOutputsInput = {
    where: DesignWhereUniqueInput
    create: XOR<DesignCreateWithoutDesignOutputsInput, DesignUncheckedCreateWithoutDesignOutputsInput>
  }

  export type DesignUpsertWithoutDesignOutputsInput = {
    update: XOR<DesignUpdateWithoutDesignOutputsInput, DesignUncheckedUpdateWithoutDesignOutputsInput>
    create: XOR<DesignCreateWithoutDesignOutputsInput, DesignUncheckedCreateWithoutDesignOutputsInput>
    where?: DesignWhereInput
  }

  export type DesignUpdateToOneWithWhereWithoutDesignOutputsInput = {
    where?: DesignWhereInput
    data: XOR<DesignUpdateWithoutDesignOutputsInput, DesignUncheckedUpdateWithoutDesignOutputsInput>
  }

  export type DesignUpdateWithoutDesignOutputsInput = {
    id?: StringFieldUpdateOperationsInput | string
    inputPrompt?: StringFieldUpdateOperationsInput | string
    uploadedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiModelUsed?: StringFieldUpdateOperationsInput | string
    status?: EnumDesignStatusFieldUpdateOperationsInput | $Enums.DesignStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutDesignsNestedInput
    feedback?: FeedbackUpdateManyWithoutDesignNestedInput
    preferences?: PreferencesUpdateOneWithoutDesignNestedInput
    roiCalculation?: RoiCalculationUpdateOneWithoutDesignNestedInput
  }

  export type DesignUncheckedUpdateWithoutDesignOutputsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    inputPrompt?: StringFieldUpdateOperationsInput | string
    uploadedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiModelUsed?: StringFieldUpdateOperationsInput | string
    status?: EnumDesignStatusFieldUpdateOperationsInput | $Enums.DesignStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    feedback?: FeedbackUncheckedUpdateManyWithoutDesignNestedInput
    preferences?: PreferencesUncheckedUpdateOneWithoutDesignNestedInput
    roiCalculation?: RoiCalculationUncheckedUpdateOneWithoutDesignNestedInput
  }

  export type DesignCreateWithoutRoiCalculationInput = {
    id?: string
    inputPrompt: string
    uploadedImageUrl?: string | null
    aiModelUsed: string
    status?: $Enums.DesignStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    designOutputs?: DesignOutputCreateNestedManyWithoutDesignInput
    profile: ProfileCreateNestedOneWithoutDesignsInput
    feedback?: FeedbackCreateNestedManyWithoutDesignInput
    preferences?: PreferencesCreateNestedOneWithoutDesignInput
  }

  export type DesignUncheckedCreateWithoutRoiCalculationInput = {
    id?: string
    userId: string
    inputPrompt: string
    uploadedImageUrl?: string | null
    aiModelUsed: string
    status?: $Enums.DesignStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    designOutputs?: DesignOutputUncheckedCreateNestedManyWithoutDesignInput
    feedback?: FeedbackUncheckedCreateNestedManyWithoutDesignInput
    preferences?: PreferencesUncheckedCreateNestedOneWithoutDesignInput
  }

  export type DesignCreateOrConnectWithoutRoiCalculationInput = {
    where: DesignWhereUniqueInput
    create: XOR<DesignCreateWithoutRoiCalculationInput, DesignUncheckedCreateWithoutRoiCalculationInput>
  }

  export type DesignUpsertWithoutRoiCalculationInput = {
    update: XOR<DesignUpdateWithoutRoiCalculationInput, DesignUncheckedUpdateWithoutRoiCalculationInput>
    create: XOR<DesignCreateWithoutRoiCalculationInput, DesignUncheckedCreateWithoutRoiCalculationInput>
    where?: DesignWhereInput
  }

  export type DesignUpdateToOneWithWhereWithoutRoiCalculationInput = {
    where?: DesignWhereInput
    data: XOR<DesignUpdateWithoutRoiCalculationInput, DesignUncheckedUpdateWithoutRoiCalculationInput>
  }

  export type DesignUpdateWithoutRoiCalculationInput = {
    id?: StringFieldUpdateOperationsInput | string
    inputPrompt?: StringFieldUpdateOperationsInput | string
    uploadedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiModelUsed?: StringFieldUpdateOperationsInput | string
    status?: EnumDesignStatusFieldUpdateOperationsInput | $Enums.DesignStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    designOutputs?: DesignOutputUpdateManyWithoutDesignNestedInput
    profile?: ProfileUpdateOneRequiredWithoutDesignsNestedInput
    feedback?: FeedbackUpdateManyWithoutDesignNestedInput
    preferences?: PreferencesUpdateOneWithoutDesignNestedInput
  }

  export type DesignUncheckedUpdateWithoutRoiCalculationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    inputPrompt?: StringFieldUpdateOperationsInput | string
    uploadedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiModelUsed?: StringFieldUpdateOperationsInput | string
    status?: EnumDesignStatusFieldUpdateOperationsInput | $Enums.DesignStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    designOutputs?: DesignOutputUncheckedUpdateManyWithoutDesignNestedInput
    feedback?: FeedbackUncheckedUpdateManyWithoutDesignNestedInput
    preferences?: PreferencesUncheckedUpdateOneWithoutDesignNestedInput
  }

  export type DesignCreateWithoutFeedbackInput = {
    id?: string
    inputPrompt: string
    uploadedImageUrl?: string | null
    aiModelUsed: string
    status?: $Enums.DesignStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    designOutputs?: DesignOutputCreateNestedManyWithoutDesignInput
    profile: ProfileCreateNestedOneWithoutDesignsInput
    preferences?: PreferencesCreateNestedOneWithoutDesignInput
    roiCalculation?: RoiCalculationCreateNestedOneWithoutDesignInput
  }

  export type DesignUncheckedCreateWithoutFeedbackInput = {
    id?: string
    userId: string
    inputPrompt: string
    uploadedImageUrl?: string | null
    aiModelUsed: string
    status?: $Enums.DesignStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    designOutputs?: DesignOutputUncheckedCreateNestedManyWithoutDesignInput
    preferences?: PreferencesUncheckedCreateNestedOneWithoutDesignInput
    roiCalculation?: RoiCalculationUncheckedCreateNestedOneWithoutDesignInput
  }

  export type DesignCreateOrConnectWithoutFeedbackInput = {
    where: DesignWhereUniqueInput
    create: XOR<DesignCreateWithoutFeedbackInput, DesignUncheckedCreateWithoutFeedbackInput>
  }

  export type ProfileCreateWithoutFeedbackInput = {
    id?: string
    userId: string
    name?: string | null
    company?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    designs?: DesignCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutFeedbackInput = {
    id?: string
    userId: string
    name?: string | null
    company?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    designs?: DesignUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutFeedbackInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutFeedbackInput, ProfileUncheckedCreateWithoutFeedbackInput>
  }

  export type DesignUpsertWithoutFeedbackInput = {
    update: XOR<DesignUpdateWithoutFeedbackInput, DesignUncheckedUpdateWithoutFeedbackInput>
    create: XOR<DesignCreateWithoutFeedbackInput, DesignUncheckedCreateWithoutFeedbackInput>
    where?: DesignWhereInput
  }

  export type DesignUpdateToOneWithWhereWithoutFeedbackInput = {
    where?: DesignWhereInput
    data: XOR<DesignUpdateWithoutFeedbackInput, DesignUncheckedUpdateWithoutFeedbackInput>
  }

  export type DesignUpdateWithoutFeedbackInput = {
    id?: StringFieldUpdateOperationsInput | string
    inputPrompt?: StringFieldUpdateOperationsInput | string
    uploadedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiModelUsed?: StringFieldUpdateOperationsInput | string
    status?: EnumDesignStatusFieldUpdateOperationsInput | $Enums.DesignStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    designOutputs?: DesignOutputUpdateManyWithoutDesignNestedInput
    profile?: ProfileUpdateOneRequiredWithoutDesignsNestedInput
    preferences?: PreferencesUpdateOneWithoutDesignNestedInput
    roiCalculation?: RoiCalculationUpdateOneWithoutDesignNestedInput
  }

  export type DesignUncheckedUpdateWithoutFeedbackInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    inputPrompt?: StringFieldUpdateOperationsInput | string
    uploadedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiModelUsed?: StringFieldUpdateOperationsInput | string
    status?: EnumDesignStatusFieldUpdateOperationsInput | $Enums.DesignStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    designOutputs?: DesignOutputUncheckedUpdateManyWithoutDesignNestedInput
    preferences?: PreferencesUncheckedUpdateOneWithoutDesignNestedInput
    roiCalculation?: RoiCalculationUncheckedUpdateOneWithoutDesignNestedInput
  }

  export type ProfileUpsertWithoutFeedbackInput = {
    update: XOR<ProfileUpdateWithoutFeedbackInput, ProfileUncheckedUpdateWithoutFeedbackInput>
    create: XOR<ProfileCreateWithoutFeedbackInput, ProfileUncheckedCreateWithoutFeedbackInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutFeedbackInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutFeedbackInput, ProfileUncheckedUpdateWithoutFeedbackInput>
  }

  export type ProfileUpdateWithoutFeedbackInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    designs?: DesignUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutFeedbackInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    designs?: DesignUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type DesignCreateManyProfileInput = {
    id?: string
    inputPrompt: string
    uploadedImageUrl?: string | null
    aiModelUsed: string
    status?: $Enums.DesignStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FeedbackCreateManyProfileInput = {
    id?: string
    designId: string
    rating: number
    comments?: string | null
    type?: $Enums.FeedbackType
    helpful?: boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DesignUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    inputPrompt?: StringFieldUpdateOperationsInput | string
    uploadedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiModelUsed?: StringFieldUpdateOperationsInput | string
    status?: EnumDesignStatusFieldUpdateOperationsInput | $Enums.DesignStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    designOutputs?: DesignOutputUpdateManyWithoutDesignNestedInput
    feedback?: FeedbackUpdateManyWithoutDesignNestedInput
    preferences?: PreferencesUpdateOneWithoutDesignNestedInput
    roiCalculation?: RoiCalculationUpdateOneWithoutDesignNestedInput
  }

  export type DesignUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    inputPrompt?: StringFieldUpdateOperationsInput | string
    uploadedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiModelUsed?: StringFieldUpdateOperationsInput | string
    status?: EnumDesignStatusFieldUpdateOperationsInput | $Enums.DesignStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    designOutputs?: DesignOutputUncheckedUpdateManyWithoutDesignNestedInput
    feedback?: FeedbackUncheckedUpdateManyWithoutDesignNestedInput
    preferences?: PreferencesUncheckedUpdateOneWithoutDesignNestedInput
    roiCalculation?: RoiCalculationUncheckedUpdateOneWithoutDesignNestedInput
  }

  export type DesignUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    inputPrompt?: StringFieldUpdateOperationsInput | string
    uploadedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiModelUsed?: StringFieldUpdateOperationsInput | string
    status?: EnumDesignStatusFieldUpdateOperationsInput | $Enums.DesignStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumFeedbackTypeFieldUpdateOperationsInput | $Enums.FeedbackType
    helpful?: NullableBoolFieldUpdateOperationsInput | boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    design?: DesignUpdateOneRequiredWithoutFeedbackNestedInput
  }

  export type FeedbackUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    designId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumFeedbackTypeFieldUpdateOperationsInput | $Enums.FeedbackType
    helpful?: NullableBoolFieldUpdateOperationsInput | boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    designId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumFeedbackTypeFieldUpdateOperationsInput | $Enums.FeedbackType
    helpful?: NullableBoolFieldUpdateOperationsInput | boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DesignOutputCreateManyDesignInput = {
    id?: string
    outputImageUrl: string
    variationName?: string | null
    generationParameters?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type FeedbackCreateManyDesignInput = {
    id?: string
    userId: string
    rating: number
    comments?: string | null
    type?: $Enums.FeedbackType
    helpful?: boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DesignOutputUpdateWithoutDesignInput = {
    id?: StringFieldUpdateOperationsInput | string
    outputImageUrl?: StringFieldUpdateOperationsInput | string
    variationName?: NullableStringFieldUpdateOperationsInput | string | null
    generationParameters?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DesignOutputUncheckedUpdateWithoutDesignInput = {
    id?: StringFieldUpdateOperationsInput | string
    outputImageUrl?: StringFieldUpdateOperationsInput | string
    variationName?: NullableStringFieldUpdateOperationsInput | string | null
    generationParameters?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DesignOutputUncheckedUpdateManyWithoutDesignInput = {
    id?: StringFieldUpdateOperationsInput | string
    outputImageUrl?: StringFieldUpdateOperationsInput | string
    variationName?: NullableStringFieldUpdateOperationsInput | string | null
    generationParameters?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackUpdateWithoutDesignInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumFeedbackTypeFieldUpdateOperationsInput | $Enums.FeedbackType
    helpful?: NullableBoolFieldUpdateOperationsInput | boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutFeedbackNestedInput
  }

  export type FeedbackUncheckedUpdateWithoutDesignInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumFeedbackTypeFieldUpdateOperationsInput | $Enums.FeedbackType
    helpful?: NullableBoolFieldUpdateOperationsInput | boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackUncheckedUpdateManyWithoutDesignInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumFeedbackTypeFieldUpdateOperationsInput | $Enums.FeedbackType
    helpful?: NullableBoolFieldUpdateOperationsInput | boolean | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}