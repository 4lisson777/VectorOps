
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Ticket
 * 
 */
export type Ticket = $Result.DefaultSelection<Prisma.$TicketPayload>
/**
 * Model BugReport
 * 
 */
export type BugReport = $Result.DefaultSelection<Prisma.$BugReportPayload>
/**
 * Model TicketEvent
 * 
 */
export type TicketEvent = $Result.DefaultSelection<Prisma.$TicketEventPayload>
/**
 * Model ReorderRequest
 * 
 */
export type ReorderRequest = $Result.DefaultSelection<Prisma.$ReorderRequestPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model HelpRequest
 * 
 */
export type HelpRequest = $Result.DefaultSelection<Prisma.$HelpRequestPayload>
/**
 * Model HelpRequestResponse
 * 
 */
export type HelpRequestResponse = $Result.DefaultSelection<Prisma.$HelpRequestResponsePayload>
/**
 * Model Checkpoint
 * 
 */
export type Checkpoint = $Result.DefaultSelection<Prisma.$CheckpointPayload>
/**
 * Model CheckpointConfig
 * 
 */
export type CheckpointConfig = $Result.DefaultSelection<Prisma.$CheckpointConfigPayload>
/**
 * Model TvConfig
 * 
 */
export type TvConfig = $Result.DefaultSelection<Prisma.$TvConfigPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  TECH_LEAD: 'TECH_LEAD',
  DEVELOPER: 'DEVELOPER',
  SUPPORT_LEAD: 'SUPPORT_LEAD',
  SUPPORT_MEMBER: 'SUPPORT_MEMBER',
  QA: 'QA'
};

export type Role = (typeof Role)[keyof typeof Role]


export const TicketType: {
  TICKET: 'TICKET',
  BUG: 'BUG'
};

export type TicketType = (typeof TicketType)[keyof typeof TicketType]


export const Severity: {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

export type Severity = (typeof Severity)[keyof typeof Severity]


export const TicketStatus: {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  WAITING_FOR_INFO: 'WAITING_FOR_INFO',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED'
};

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus]


export const Environment: {
  PRODUCTION: 'PRODUCTION',
  STAGING: 'STAGING',
  OTHER: 'OTHER'
};

export type Environment = (typeof Environment)[keyof typeof Environment]


export const TicketEventType: {
  CREATED: 'CREATED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  ASSIGNED: 'ASSIGNED',
  REASSIGNED: 'REASSIGNED',
  SEVERITY_CHANGED: 'SEVERITY_CHANGED',
  DEADLINE_CHANGED: 'DEADLINE_CHANGED',
  PRIORITY_REORDERED: 'PRIORITY_REORDERED',
  REORDER_REQUESTED: 'REORDER_REQUESTED',
  REORDER_APPROVED: 'REORDER_APPROVED',
  REORDER_DECLINED: 'REORDER_DECLINED',
  HELP_REQUESTED: 'HELP_REQUESTED',
  CHECKPOINT_MENTION: 'CHECKPOINT_MENTION',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED'
};

export type TicketEventType = (typeof TicketEventType)[keyof typeof TicketEventType]


export const ReorderStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED'
};

export type ReorderStatus = (typeof ReorderStatus)[keyof typeof ReorderStatus]


export const DevStatus: {
  ACTIVE: 'ACTIVE',
  IN_CHECKPOINT: 'IN_CHECKPOINT',
  BLOCKED: 'BLOCKED',
  HELPING: 'HELPING'
};

export type DevStatus = (typeof DevStatus)[keyof typeof DevStatus]


export const NotificationType: {
  TICKET_CREATED: 'TICKET_CREATED',
  BUG_CREATED: 'BUG_CREATED',
  TICKET_ASSIGNED: 'TICKET_ASSIGNED',
  TICKET_STATUS_CHANGED: 'TICKET_STATUS_CHANGED',
  TICKET_DONE: 'TICKET_DONE',
  TICKET_CANCELLED: 'TICKET_CANCELLED',
  HELP_REQUEST_NEW: 'HELP_REQUEST_NEW',
  HELP_REQUEST_RESPONDED: 'HELP_REQUEST_RESPONDED',
  CHECKPOINT_PROMPT: 'CHECKPOINT_PROMPT'
};

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type TicketType = $Enums.TicketType

export const TicketType: typeof $Enums.TicketType

export type Severity = $Enums.Severity

export const Severity: typeof $Enums.Severity

export type TicketStatus = $Enums.TicketStatus

export const TicketStatus: typeof $Enums.TicketStatus

export type Environment = $Enums.Environment

export const Environment: typeof $Enums.Environment

export type TicketEventType = $Enums.TicketEventType

export const TicketEventType: typeof $Enums.TicketEventType

export type ReorderStatus = $Enums.ReorderStatus

export const ReorderStatus: typeof $Enums.ReorderStatus

export type DevStatus = $Enums.DevStatus

export const DevStatus: typeof $Enums.DevStatus

export type NotificationType = $Enums.NotificationType

export const NotificationType: typeof $Enums.NotificationType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
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
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ticket`: Exposes CRUD operations for the **Ticket** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tickets
    * const tickets = await prisma.ticket.findMany()
    * ```
    */
  get ticket(): Prisma.TicketDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bugReport`: Exposes CRUD operations for the **BugReport** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BugReports
    * const bugReports = await prisma.bugReport.findMany()
    * ```
    */
  get bugReport(): Prisma.BugReportDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ticketEvent`: Exposes CRUD operations for the **TicketEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TicketEvents
    * const ticketEvents = await prisma.ticketEvent.findMany()
    * ```
    */
  get ticketEvent(): Prisma.TicketEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.reorderRequest`: Exposes CRUD operations for the **ReorderRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReorderRequests
    * const reorderRequests = await prisma.reorderRequest.findMany()
    * ```
    */
  get reorderRequest(): Prisma.ReorderRequestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.helpRequest`: Exposes CRUD operations for the **HelpRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HelpRequests
    * const helpRequests = await prisma.helpRequest.findMany()
    * ```
    */
  get helpRequest(): Prisma.HelpRequestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.helpRequestResponse`: Exposes CRUD operations for the **HelpRequestResponse** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HelpRequestResponses
    * const helpRequestResponses = await prisma.helpRequestResponse.findMany()
    * ```
    */
  get helpRequestResponse(): Prisma.HelpRequestResponseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.checkpoint`: Exposes CRUD operations for the **Checkpoint** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Checkpoints
    * const checkpoints = await prisma.checkpoint.findMany()
    * ```
    */
  get checkpoint(): Prisma.CheckpointDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.checkpointConfig`: Exposes CRUD operations for the **CheckpointConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CheckpointConfigs
    * const checkpointConfigs = await prisma.checkpointConfig.findMany()
    * ```
    */
  get checkpointConfig(): Prisma.CheckpointConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tvConfig`: Exposes CRUD operations for the **TvConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TvConfigs
    * const tvConfigs = await prisma.tvConfig.findMany()
    * ```
    */
  get tvConfig(): Prisma.TvConfigDelegate<ExtArgs, ClientOptions>;
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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.6.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
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
    User: 'User',
    Ticket: 'Ticket',
    BugReport: 'BugReport',
    TicketEvent: 'TicketEvent',
    ReorderRequest: 'ReorderRequest',
    Notification: 'Notification',
    HelpRequest: 'HelpRequest',
    HelpRequestResponse: 'HelpRequestResponse',
    Checkpoint: 'Checkpoint',
    CheckpointConfig: 'CheckpointConfig',
    TvConfig: 'TvConfig'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "ticket" | "bugReport" | "ticketEvent" | "reorderRequest" | "notification" | "helpRequest" | "helpRequestResponse" | "checkpoint" | "checkpointConfig" | "tvConfig"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Ticket: {
        payload: Prisma.$TicketPayload<ExtArgs>
        fields: Prisma.TicketFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TicketFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TicketFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          findFirst: {
            args: Prisma.TicketFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TicketFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          findMany: {
            args: Prisma.TicketFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>[]
          }
          create: {
            args: Prisma.TicketCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          createMany: {
            args: Prisma.TicketCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TicketCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>[]
          }
          delete: {
            args: Prisma.TicketDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          update: {
            args: Prisma.TicketUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          deleteMany: {
            args: Prisma.TicketDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TicketUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TicketUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>[]
          }
          upsert: {
            args: Prisma.TicketUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          aggregate: {
            args: Prisma.TicketAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTicket>
          }
          groupBy: {
            args: Prisma.TicketGroupByArgs<ExtArgs>
            result: $Utils.Optional<TicketGroupByOutputType>[]
          }
          count: {
            args: Prisma.TicketCountArgs<ExtArgs>
            result: $Utils.Optional<TicketCountAggregateOutputType> | number
          }
        }
      }
      BugReport: {
        payload: Prisma.$BugReportPayload<ExtArgs>
        fields: Prisma.BugReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BugReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BugReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BugReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BugReportPayload>
          }
          findFirst: {
            args: Prisma.BugReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BugReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BugReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BugReportPayload>
          }
          findMany: {
            args: Prisma.BugReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BugReportPayload>[]
          }
          create: {
            args: Prisma.BugReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BugReportPayload>
          }
          createMany: {
            args: Prisma.BugReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BugReportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BugReportPayload>[]
          }
          delete: {
            args: Prisma.BugReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BugReportPayload>
          }
          update: {
            args: Prisma.BugReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BugReportPayload>
          }
          deleteMany: {
            args: Prisma.BugReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BugReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BugReportUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BugReportPayload>[]
          }
          upsert: {
            args: Prisma.BugReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BugReportPayload>
          }
          aggregate: {
            args: Prisma.BugReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBugReport>
          }
          groupBy: {
            args: Prisma.BugReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<BugReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.BugReportCountArgs<ExtArgs>
            result: $Utils.Optional<BugReportCountAggregateOutputType> | number
          }
        }
      }
      TicketEvent: {
        payload: Prisma.$TicketEventPayload<ExtArgs>
        fields: Prisma.TicketEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TicketEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TicketEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketEventPayload>
          }
          findFirst: {
            args: Prisma.TicketEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TicketEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketEventPayload>
          }
          findMany: {
            args: Prisma.TicketEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketEventPayload>[]
          }
          create: {
            args: Prisma.TicketEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketEventPayload>
          }
          createMany: {
            args: Prisma.TicketEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TicketEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketEventPayload>[]
          }
          delete: {
            args: Prisma.TicketEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketEventPayload>
          }
          update: {
            args: Prisma.TicketEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketEventPayload>
          }
          deleteMany: {
            args: Prisma.TicketEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TicketEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TicketEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketEventPayload>[]
          }
          upsert: {
            args: Prisma.TicketEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketEventPayload>
          }
          aggregate: {
            args: Prisma.TicketEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTicketEvent>
          }
          groupBy: {
            args: Prisma.TicketEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<TicketEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.TicketEventCountArgs<ExtArgs>
            result: $Utils.Optional<TicketEventCountAggregateOutputType> | number
          }
        }
      }
      ReorderRequest: {
        payload: Prisma.$ReorderRequestPayload<ExtArgs>
        fields: Prisma.ReorderRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReorderRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReorderRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReorderRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReorderRequestPayload>
          }
          findFirst: {
            args: Prisma.ReorderRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReorderRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReorderRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReorderRequestPayload>
          }
          findMany: {
            args: Prisma.ReorderRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReorderRequestPayload>[]
          }
          create: {
            args: Prisma.ReorderRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReorderRequestPayload>
          }
          createMany: {
            args: Prisma.ReorderRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReorderRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReorderRequestPayload>[]
          }
          delete: {
            args: Prisma.ReorderRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReorderRequestPayload>
          }
          update: {
            args: Prisma.ReorderRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReorderRequestPayload>
          }
          deleteMany: {
            args: Prisma.ReorderRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReorderRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReorderRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReorderRequestPayload>[]
          }
          upsert: {
            args: Prisma.ReorderRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReorderRequestPayload>
          }
          aggregate: {
            args: Prisma.ReorderRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReorderRequest>
          }
          groupBy: {
            args: Prisma.ReorderRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReorderRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReorderRequestCountArgs<ExtArgs>
            result: $Utils.Optional<ReorderRequestCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      HelpRequest: {
        payload: Prisma.$HelpRequestPayload<ExtArgs>
        fields: Prisma.HelpRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HelpRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HelpRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestPayload>
          }
          findFirst: {
            args: Prisma.HelpRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HelpRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestPayload>
          }
          findMany: {
            args: Prisma.HelpRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestPayload>[]
          }
          create: {
            args: Prisma.HelpRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestPayload>
          }
          createMany: {
            args: Prisma.HelpRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HelpRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestPayload>[]
          }
          delete: {
            args: Prisma.HelpRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestPayload>
          }
          update: {
            args: Prisma.HelpRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestPayload>
          }
          deleteMany: {
            args: Prisma.HelpRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HelpRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.HelpRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestPayload>[]
          }
          upsert: {
            args: Prisma.HelpRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestPayload>
          }
          aggregate: {
            args: Prisma.HelpRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHelpRequest>
          }
          groupBy: {
            args: Prisma.HelpRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<HelpRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.HelpRequestCountArgs<ExtArgs>
            result: $Utils.Optional<HelpRequestCountAggregateOutputType> | number
          }
        }
      }
      HelpRequestResponse: {
        payload: Prisma.$HelpRequestResponsePayload<ExtArgs>
        fields: Prisma.HelpRequestResponseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HelpRequestResponseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestResponsePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HelpRequestResponseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestResponsePayload>
          }
          findFirst: {
            args: Prisma.HelpRequestResponseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestResponsePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HelpRequestResponseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestResponsePayload>
          }
          findMany: {
            args: Prisma.HelpRequestResponseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestResponsePayload>[]
          }
          create: {
            args: Prisma.HelpRequestResponseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestResponsePayload>
          }
          createMany: {
            args: Prisma.HelpRequestResponseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HelpRequestResponseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestResponsePayload>[]
          }
          delete: {
            args: Prisma.HelpRequestResponseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestResponsePayload>
          }
          update: {
            args: Prisma.HelpRequestResponseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestResponsePayload>
          }
          deleteMany: {
            args: Prisma.HelpRequestResponseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HelpRequestResponseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.HelpRequestResponseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestResponsePayload>[]
          }
          upsert: {
            args: Prisma.HelpRequestResponseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HelpRequestResponsePayload>
          }
          aggregate: {
            args: Prisma.HelpRequestResponseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHelpRequestResponse>
          }
          groupBy: {
            args: Prisma.HelpRequestResponseGroupByArgs<ExtArgs>
            result: $Utils.Optional<HelpRequestResponseGroupByOutputType>[]
          }
          count: {
            args: Prisma.HelpRequestResponseCountArgs<ExtArgs>
            result: $Utils.Optional<HelpRequestResponseCountAggregateOutputType> | number
          }
        }
      }
      Checkpoint: {
        payload: Prisma.$CheckpointPayload<ExtArgs>
        fields: Prisma.CheckpointFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CheckpointFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CheckpointFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointPayload>
          }
          findFirst: {
            args: Prisma.CheckpointFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CheckpointFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointPayload>
          }
          findMany: {
            args: Prisma.CheckpointFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointPayload>[]
          }
          create: {
            args: Prisma.CheckpointCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointPayload>
          }
          createMany: {
            args: Prisma.CheckpointCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CheckpointCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointPayload>[]
          }
          delete: {
            args: Prisma.CheckpointDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointPayload>
          }
          update: {
            args: Prisma.CheckpointUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointPayload>
          }
          deleteMany: {
            args: Prisma.CheckpointDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CheckpointUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CheckpointUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointPayload>[]
          }
          upsert: {
            args: Prisma.CheckpointUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointPayload>
          }
          aggregate: {
            args: Prisma.CheckpointAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCheckpoint>
          }
          groupBy: {
            args: Prisma.CheckpointGroupByArgs<ExtArgs>
            result: $Utils.Optional<CheckpointGroupByOutputType>[]
          }
          count: {
            args: Prisma.CheckpointCountArgs<ExtArgs>
            result: $Utils.Optional<CheckpointCountAggregateOutputType> | number
          }
        }
      }
      CheckpointConfig: {
        payload: Prisma.$CheckpointConfigPayload<ExtArgs>
        fields: Prisma.CheckpointConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CheckpointConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CheckpointConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointConfigPayload>
          }
          findFirst: {
            args: Prisma.CheckpointConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CheckpointConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointConfigPayload>
          }
          findMany: {
            args: Prisma.CheckpointConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointConfigPayload>[]
          }
          create: {
            args: Prisma.CheckpointConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointConfigPayload>
          }
          createMany: {
            args: Prisma.CheckpointConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CheckpointConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointConfigPayload>[]
          }
          delete: {
            args: Prisma.CheckpointConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointConfigPayload>
          }
          update: {
            args: Prisma.CheckpointConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointConfigPayload>
          }
          deleteMany: {
            args: Prisma.CheckpointConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CheckpointConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CheckpointConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointConfigPayload>[]
          }
          upsert: {
            args: Prisma.CheckpointConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CheckpointConfigPayload>
          }
          aggregate: {
            args: Prisma.CheckpointConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCheckpointConfig>
          }
          groupBy: {
            args: Prisma.CheckpointConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<CheckpointConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.CheckpointConfigCountArgs<ExtArgs>
            result: $Utils.Optional<CheckpointConfigCountAggregateOutputType> | number
          }
        }
      }
      TvConfig: {
        payload: Prisma.$TvConfigPayload<ExtArgs>
        fields: Prisma.TvConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TvConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TvConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TvConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TvConfigPayload>
          }
          findFirst: {
            args: Prisma.TvConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TvConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TvConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TvConfigPayload>
          }
          findMany: {
            args: Prisma.TvConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TvConfigPayload>[]
          }
          create: {
            args: Prisma.TvConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TvConfigPayload>
          }
          createMany: {
            args: Prisma.TvConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TvConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TvConfigPayload>[]
          }
          delete: {
            args: Prisma.TvConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TvConfigPayload>
          }
          update: {
            args: Prisma.TvConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TvConfigPayload>
          }
          deleteMany: {
            args: Prisma.TvConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TvConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TvConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TvConfigPayload>[]
          }
          upsert: {
            args: Prisma.TvConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TvConfigPayload>
          }
          aggregate: {
            args: Prisma.TvConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTvConfig>
          }
          groupBy: {
            args: Prisma.TvConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<TvConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.TvConfigCountArgs<ExtArgs>
            result: $Utils.Optional<TvConfigCountAggregateOutputType> | number
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
     * Read more in our [docs](https://pris.ly/d/logging).
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
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
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
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    ticket?: TicketOmit
    bugReport?: BugReportOmit
    ticketEvent?: TicketEventOmit
    reorderRequest?: ReorderRequestOmit
    notification?: NotificationOmit
    helpRequest?: HelpRequestOmit
    helpRequestResponse?: HelpRequestResponseOmit
    checkpoint?: CheckpointOmit
    checkpointConfig?: CheckpointConfigOmit
    tvConfig?: TvConfigOmit
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    openedTickets: number
    assignedTickets: number
    actorEvents: number
    requestedReorders: number
    resolvedReorders: number
    notifications: number
    requestedHelp: number
    helpResponses: number
    checkpoints: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    openedTickets?: boolean | UserCountOutputTypeCountOpenedTicketsArgs
    assignedTickets?: boolean | UserCountOutputTypeCountAssignedTicketsArgs
    actorEvents?: boolean | UserCountOutputTypeCountActorEventsArgs
    requestedReorders?: boolean | UserCountOutputTypeCountRequestedReordersArgs
    resolvedReorders?: boolean | UserCountOutputTypeCountResolvedReordersArgs
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs
    requestedHelp?: boolean | UserCountOutputTypeCountRequestedHelpArgs
    helpResponses?: boolean | UserCountOutputTypeCountHelpResponsesArgs
    checkpoints?: boolean | UserCountOutputTypeCountCheckpointsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOpenedTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAssignedTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountActorEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketEventWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRequestedReordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReorderRequestWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountResolvedReordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReorderRequestWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRequestedHelpArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HelpRequestWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountHelpResponsesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HelpRequestResponseWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCheckpointsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CheckpointWhereInput
  }


  /**
   * Count Type TicketCountOutputType
   */

  export type TicketCountOutputType = {
    events: number
    reorderRequests: number
    notifications: number
  }

  export type TicketCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | TicketCountOutputTypeCountEventsArgs
    reorderRequests?: boolean | TicketCountOutputTypeCountReorderRequestsArgs
    notifications?: boolean | TicketCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * TicketCountOutputType without action
   */
  export type TicketCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketCountOutputType
     */
    select?: TicketCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TicketCountOutputType without action
   */
  export type TicketCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketEventWhereInput
  }

  /**
   * TicketCountOutputType without action
   */
  export type TicketCountOutputTypeCountReorderRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReorderRequestWhereInput
  }

  /**
   * TicketCountOutputType without action
   */
  export type TicketCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type HelpRequestCountOutputType
   */

  export type HelpRequestCountOutputType = {
    responses: number
  }

  export type HelpRequestCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    responses?: boolean | HelpRequestCountOutputTypeCountResponsesArgs
  }

  // Custom InputTypes
  /**
   * HelpRequestCountOutputType without action
   */
  export type HelpRequestCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequestCountOutputType
     */
    select?: HelpRequestCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * HelpRequestCountOutputType without action
   */
  export type HelpRequestCountOutputTypeCountResponsesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HelpRequestResponseWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    role: $Enums.Role | null
    avatarUrl: string | null
    ninjaAlias: string | null
    isActive: boolean | null
    notifyTickets: boolean | null
    notifyBugs: boolean | null
    soundEnabled: boolean | null
    devStatus: $Enums.DevStatus | null
    currentTask: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    role: $Enums.Role | null
    avatarUrl: string | null
    ninjaAlias: string | null
    isActive: boolean | null
    notifyTickets: boolean | null
    notifyBugs: boolean | null
    soundEnabled: boolean | null
    devStatus: $Enums.DevStatus | null
    currentTask: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    passwordHash: number
    role: number
    avatarUrl: number
    ninjaAlias: number
    isActive: number
    notifyTickets: number
    notifyBugs: number
    soundEnabled: number
    devStatus: number
    currentTask: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    avatarUrl?: true
    ninjaAlias?: true
    isActive?: true
    notifyTickets?: true
    notifyBugs?: true
    soundEnabled?: true
    devStatus?: true
    currentTask?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    avatarUrl?: true
    ninjaAlias?: true
    isActive?: true
    notifyTickets?: true
    notifyBugs?: true
    soundEnabled?: true
    devStatus?: true
    currentTask?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    avatarUrl?: true
    ninjaAlias?: true
    isActive?: true
    notifyTickets?: true
    notifyBugs?: true
    soundEnabled?: true
    devStatus?: true
    currentTask?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl: string | null
    ninjaAlias: string
    isActive: boolean
    notifyTickets: boolean
    notifyBugs: boolean
    soundEnabled: boolean
    devStatus: $Enums.DevStatus | null
    currentTask: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    avatarUrl?: boolean
    ninjaAlias?: boolean
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: boolean
    currentTask?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    openedTickets?: boolean | User$openedTicketsArgs<ExtArgs>
    assignedTickets?: boolean | User$assignedTicketsArgs<ExtArgs>
    actorEvents?: boolean | User$actorEventsArgs<ExtArgs>
    requestedReorders?: boolean | User$requestedReordersArgs<ExtArgs>
    resolvedReorders?: boolean | User$resolvedReordersArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    requestedHelp?: boolean | User$requestedHelpArgs<ExtArgs>
    helpResponses?: boolean | User$helpResponsesArgs<ExtArgs>
    checkpoints?: boolean | User$checkpointsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    avatarUrl?: boolean
    ninjaAlias?: boolean
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: boolean
    currentTask?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    avatarUrl?: boolean
    ninjaAlias?: boolean
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: boolean
    currentTask?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    avatarUrl?: boolean
    ninjaAlias?: boolean
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: boolean
    currentTask?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "passwordHash" | "role" | "avatarUrl" | "ninjaAlias" | "isActive" | "notifyTickets" | "notifyBugs" | "soundEnabled" | "devStatus" | "currentTask" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    openedTickets?: boolean | User$openedTicketsArgs<ExtArgs>
    assignedTickets?: boolean | User$assignedTicketsArgs<ExtArgs>
    actorEvents?: boolean | User$actorEventsArgs<ExtArgs>
    requestedReorders?: boolean | User$requestedReordersArgs<ExtArgs>
    resolvedReorders?: boolean | User$resolvedReordersArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    requestedHelp?: boolean | User$requestedHelpArgs<ExtArgs>
    helpResponses?: boolean | User$helpResponsesArgs<ExtArgs>
    checkpoints?: boolean | User$checkpointsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      openedTickets: Prisma.$TicketPayload<ExtArgs>[]
      assignedTickets: Prisma.$TicketPayload<ExtArgs>[]
      actorEvents: Prisma.$TicketEventPayload<ExtArgs>[]
      requestedReorders: Prisma.$ReorderRequestPayload<ExtArgs>[]
      resolvedReorders: Prisma.$ReorderRequestPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
      requestedHelp: Prisma.$HelpRequestPayload<ExtArgs>[]
      helpResponses: Prisma.$HelpRequestResponsePayload<ExtArgs>[]
      checkpoints: Prisma.$CheckpointPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      passwordHash: string
      role: $Enums.Role
      avatarUrl: string | null
      ninjaAlias: string
      isActive: boolean
      notifyTickets: boolean
      notifyBugs: boolean
      soundEnabled: boolean
      devStatus: $Enums.DevStatus | null
      currentTask: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    openedTickets<T extends User$openedTicketsArgs<ExtArgs> = {}>(args?: Subset<T, User$openedTicketsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    assignedTickets<T extends User$assignedTicketsArgs<ExtArgs> = {}>(args?: Subset<T, User$assignedTicketsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    actorEvents<T extends User$actorEventsArgs<ExtArgs> = {}>(args?: Subset<T, User$actorEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    requestedReorders<T extends User$requestedReordersArgs<ExtArgs> = {}>(args?: Subset<T, User$requestedReordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReorderRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    resolvedReorders<T extends User$resolvedReordersArgs<ExtArgs> = {}>(args?: Subset<T, User$resolvedReordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReorderRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends User$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    requestedHelp<T extends User$requestedHelpArgs<ExtArgs> = {}>(args?: Subset<T, User$requestedHelpArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    helpResponses<T extends User$helpResponsesArgs<ExtArgs> = {}>(args?: Subset<T, User$helpResponsesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HelpRequestResponsePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    checkpoints<T extends User$checkpointsArgs<ExtArgs> = {}>(args?: Subset<T, User$checkpointsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CheckpointPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly avatarUrl: FieldRef<"User", 'String'>
    readonly ninjaAlias: FieldRef<"User", 'String'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly notifyTickets: FieldRef<"User", 'Boolean'>
    readonly notifyBugs: FieldRef<"User", 'Boolean'>
    readonly soundEnabled: FieldRef<"User", 'Boolean'>
    readonly devStatus: FieldRef<"User", 'DevStatus'>
    readonly currentTask: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.openedTickets
   */
  export type User$openedTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    where?: TicketWhereInput
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    cursor?: TicketWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * User.assignedTickets
   */
  export type User$assignedTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    where?: TicketWhereInput
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    cursor?: TicketWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * User.actorEvents
   */
  export type User$actorEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketEvent
     */
    select?: TicketEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketEvent
     */
    omit?: TicketEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketEventInclude<ExtArgs> | null
    where?: TicketEventWhereInput
    orderBy?: TicketEventOrderByWithRelationInput | TicketEventOrderByWithRelationInput[]
    cursor?: TicketEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketEventScalarFieldEnum | TicketEventScalarFieldEnum[]
  }

  /**
   * User.requestedReorders
   */
  export type User$requestedReordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReorderRequest
     */
    select?: ReorderRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReorderRequest
     */
    omit?: ReorderRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReorderRequestInclude<ExtArgs> | null
    where?: ReorderRequestWhereInput
    orderBy?: ReorderRequestOrderByWithRelationInput | ReorderRequestOrderByWithRelationInput[]
    cursor?: ReorderRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReorderRequestScalarFieldEnum | ReorderRequestScalarFieldEnum[]
  }

  /**
   * User.resolvedReorders
   */
  export type User$resolvedReordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReorderRequest
     */
    select?: ReorderRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReorderRequest
     */
    omit?: ReorderRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReorderRequestInclude<ExtArgs> | null
    where?: ReorderRequestWhereInput
    orderBy?: ReorderRequestOrderByWithRelationInput | ReorderRequestOrderByWithRelationInput[]
    cursor?: ReorderRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReorderRequestScalarFieldEnum | ReorderRequestScalarFieldEnum[]
  }

  /**
   * User.notifications
   */
  export type User$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User.requestedHelp
   */
  export type User$requestedHelpArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: HelpRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: HelpRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestInclude<ExtArgs> | null
    where?: HelpRequestWhereInput
    orderBy?: HelpRequestOrderByWithRelationInput | HelpRequestOrderByWithRelationInput[]
    cursor?: HelpRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: HelpRequestScalarFieldEnum | HelpRequestScalarFieldEnum[]
  }

  /**
   * User.helpResponses
   */
  export type User$helpResponsesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequestResponse
     */
    select?: HelpRequestResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequestResponse
     */
    omit?: HelpRequestResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestResponseInclude<ExtArgs> | null
    where?: HelpRequestResponseWhereInput
    orderBy?: HelpRequestResponseOrderByWithRelationInput | HelpRequestResponseOrderByWithRelationInput[]
    cursor?: HelpRequestResponseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: HelpRequestResponseScalarFieldEnum | HelpRequestResponseScalarFieldEnum[]
  }

  /**
   * User.checkpoints
   */
  export type User$checkpointsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Checkpoint
     */
    select?: CheckpointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Checkpoint
     */
    omit?: CheckpointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CheckpointInclude<ExtArgs> | null
    where?: CheckpointWhereInput
    orderBy?: CheckpointOrderByWithRelationInput | CheckpointOrderByWithRelationInput[]
    cursor?: CheckpointWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CheckpointScalarFieldEnum | CheckpointScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Ticket
   */

  export type AggregateTicket = {
    _count: TicketCountAggregateOutputType | null
    _avg: TicketAvgAggregateOutputType | null
    _sum: TicketSumAggregateOutputType | null
    _min: TicketMinAggregateOutputType | null
    _max: TicketMaxAggregateOutputType | null
  }

  export type TicketAvgAggregateOutputType = {
    priorityOrder: number | null
  }

  export type TicketSumAggregateOutputType = {
    priorityOrder: number | null
  }

  export type TicketMinAggregateOutputType = {
    id: string | null
    publicId: string | null
    title: string | null
    description: string | null
    type: $Enums.TicketType | null
    severity: $Enums.Severity | null
    status: $Enums.TicketStatus | null
    deadline: Date | null
    priorityOrder: number | null
    openedById: string | null
    assignedToId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    resolvedAt: Date | null
  }

  export type TicketMaxAggregateOutputType = {
    id: string | null
    publicId: string | null
    title: string | null
    description: string | null
    type: $Enums.TicketType | null
    severity: $Enums.Severity | null
    status: $Enums.TicketStatus | null
    deadline: Date | null
    priorityOrder: number | null
    openedById: string | null
    assignedToId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    resolvedAt: Date | null
  }

  export type TicketCountAggregateOutputType = {
    id: number
    publicId: number
    title: number
    description: number
    type: number
    severity: number
    status: number
    deadline: number
    priorityOrder: number
    openedById: number
    assignedToId: number
    createdAt: number
    updatedAt: number
    resolvedAt: number
    _all: number
  }


  export type TicketAvgAggregateInputType = {
    priorityOrder?: true
  }

  export type TicketSumAggregateInputType = {
    priorityOrder?: true
  }

  export type TicketMinAggregateInputType = {
    id?: true
    publicId?: true
    title?: true
    description?: true
    type?: true
    severity?: true
    status?: true
    deadline?: true
    priorityOrder?: true
    openedById?: true
    assignedToId?: true
    createdAt?: true
    updatedAt?: true
    resolvedAt?: true
  }

  export type TicketMaxAggregateInputType = {
    id?: true
    publicId?: true
    title?: true
    description?: true
    type?: true
    severity?: true
    status?: true
    deadline?: true
    priorityOrder?: true
    openedById?: true
    assignedToId?: true
    createdAt?: true
    updatedAt?: true
    resolvedAt?: true
  }

  export type TicketCountAggregateInputType = {
    id?: true
    publicId?: true
    title?: true
    description?: true
    type?: true
    severity?: true
    status?: true
    deadline?: true
    priorityOrder?: true
    openedById?: true
    assignedToId?: true
    createdAt?: true
    updatedAt?: true
    resolvedAt?: true
    _all?: true
  }

  export type TicketAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ticket to aggregate.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tickets
    **/
    _count?: true | TicketCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TicketAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TicketSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TicketMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TicketMaxAggregateInputType
  }

  export type GetTicketAggregateType<T extends TicketAggregateArgs> = {
        [P in keyof T & keyof AggregateTicket]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTicket[P]>
      : GetScalarType<T[P], AggregateTicket[P]>
  }




  export type TicketGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketWhereInput
    orderBy?: TicketOrderByWithAggregationInput | TicketOrderByWithAggregationInput[]
    by: TicketScalarFieldEnum[] | TicketScalarFieldEnum
    having?: TicketScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TicketCountAggregateInputType | true
    _avg?: TicketAvgAggregateInputType
    _sum?: TicketSumAggregateInputType
    _min?: TicketMinAggregateInputType
    _max?: TicketMaxAggregateInputType
  }

  export type TicketGroupByOutputType = {
    id: string
    publicId: string
    title: string
    description: string
    type: $Enums.TicketType
    severity: $Enums.Severity
    status: $Enums.TicketStatus
    deadline: Date
    priorityOrder: number
    openedById: string
    assignedToId: string | null
    createdAt: Date
    updatedAt: Date
    resolvedAt: Date | null
    _count: TicketCountAggregateOutputType | null
    _avg: TicketAvgAggregateOutputType | null
    _sum: TicketSumAggregateOutputType | null
    _min: TicketMinAggregateOutputType | null
    _max: TicketMaxAggregateOutputType | null
  }

  type GetTicketGroupByPayload<T extends TicketGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TicketGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TicketGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TicketGroupByOutputType[P]>
            : GetScalarType<T[P], TicketGroupByOutputType[P]>
        }
      >
    >


  export type TicketSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    publicId?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    severity?: boolean
    status?: boolean
    deadline?: boolean
    priorityOrder?: boolean
    openedById?: boolean
    assignedToId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resolvedAt?: boolean
    openedBy?: boolean | UserDefaultArgs<ExtArgs>
    assignedTo?: boolean | Ticket$assignedToArgs<ExtArgs>
    bugReport?: boolean | Ticket$bugReportArgs<ExtArgs>
    events?: boolean | Ticket$eventsArgs<ExtArgs>
    reorderRequests?: boolean | Ticket$reorderRequestsArgs<ExtArgs>
    notifications?: boolean | Ticket$notificationsArgs<ExtArgs>
    _count?: boolean | TicketCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticket"]>

  export type TicketSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    publicId?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    severity?: boolean
    status?: boolean
    deadline?: boolean
    priorityOrder?: boolean
    openedById?: boolean
    assignedToId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resolvedAt?: boolean
    openedBy?: boolean | UserDefaultArgs<ExtArgs>
    assignedTo?: boolean | Ticket$assignedToArgs<ExtArgs>
  }, ExtArgs["result"]["ticket"]>

  export type TicketSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    publicId?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    severity?: boolean
    status?: boolean
    deadline?: boolean
    priorityOrder?: boolean
    openedById?: boolean
    assignedToId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resolvedAt?: boolean
    openedBy?: boolean | UserDefaultArgs<ExtArgs>
    assignedTo?: boolean | Ticket$assignedToArgs<ExtArgs>
  }, ExtArgs["result"]["ticket"]>

  export type TicketSelectScalar = {
    id?: boolean
    publicId?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    severity?: boolean
    status?: boolean
    deadline?: boolean
    priorityOrder?: boolean
    openedById?: boolean
    assignedToId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resolvedAt?: boolean
  }

  export type TicketOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "publicId" | "title" | "description" | "type" | "severity" | "status" | "deadline" | "priorityOrder" | "openedById" | "assignedToId" | "createdAt" | "updatedAt" | "resolvedAt", ExtArgs["result"]["ticket"]>
  export type TicketInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    openedBy?: boolean | UserDefaultArgs<ExtArgs>
    assignedTo?: boolean | Ticket$assignedToArgs<ExtArgs>
    bugReport?: boolean | Ticket$bugReportArgs<ExtArgs>
    events?: boolean | Ticket$eventsArgs<ExtArgs>
    reorderRequests?: boolean | Ticket$reorderRequestsArgs<ExtArgs>
    notifications?: boolean | Ticket$notificationsArgs<ExtArgs>
    _count?: boolean | TicketCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TicketIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    openedBy?: boolean | UserDefaultArgs<ExtArgs>
    assignedTo?: boolean | Ticket$assignedToArgs<ExtArgs>
  }
  export type TicketIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    openedBy?: boolean | UserDefaultArgs<ExtArgs>
    assignedTo?: boolean | Ticket$assignedToArgs<ExtArgs>
  }

  export type $TicketPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Ticket"
    objects: {
      openedBy: Prisma.$UserPayload<ExtArgs>
      assignedTo: Prisma.$UserPayload<ExtArgs> | null
      bugReport: Prisma.$BugReportPayload<ExtArgs> | null
      events: Prisma.$TicketEventPayload<ExtArgs>[]
      reorderRequests: Prisma.$ReorderRequestPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      publicId: string
      title: string
      description: string
      type: $Enums.TicketType
      severity: $Enums.Severity
      status: $Enums.TicketStatus
      deadline: Date
      priorityOrder: number
      openedById: string
      assignedToId: string | null
      createdAt: Date
      updatedAt: Date
      resolvedAt: Date | null
    }, ExtArgs["result"]["ticket"]>
    composites: {}
  }

  type TicketGetPayload<S extends boolean | null | undefined | TicketDefaultArgs> = $Result.GetResult<Prisma.$TicketPayload, S>

  type TicketCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TicketFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TicketCountAggregateInputType | true
    }

  export interface TicketDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ticket'], meta: { name: 'Ticket' } }
    /**
     * Find zero or one Ticket that matches the filter.
     * @param {TicketFindUniqueArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TicketFindUniqueArgs>(args: SelectSubset<T, TicketFindUniqueArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Ticket that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TicketFindUniqueOrThrowArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TicketFindUniqueOrThrowArgs>(args: SelectSubset<T, TicketFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ticket that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindFirstArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TicketFindFirstArgs>(args?: SelectSubset<T, TicketFindFirstArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ticket that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindFirstOrThrowArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TicketFindFirstOrThrowArgs>(args?: SelectSubset<T, TicketFindFirstOrThrowArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tickets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tickets
     * const tickets = await prisma.ticket.findMany()
     * 
     * // Get first 10 Tickets
     * const tickets = await prisma.ticket.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ticketWithIdOnly = await prisma.ticket.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TicketFindManyArgs>(args?: SelectSubset<T, TicketFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Ticket.
     * @param {TicketCreateArgs} args - Arguments to create a Ticket.
     * @example
     * // Create one Ticket
     * const Ticket = await prisma.ticket.create({
     *   data: {
     *     // ... data to create a Ticket
     *   }
     * })
     * 
     */
    create<T extends TicketCreateArgs>(args: SelectSubset<T, TicketCreateArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tickets.
     * @param {TicketCreateManyArgs} args - Arguments to create many Tickets.
     * @example
     * // Create many Tickets
     * const ticket = await prisma.ticket.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TicketCreateManyArgs>(args?: SelectSubset<T, TicketCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tickets and returns the data saved in the database.
     * @param {TicketCreateManyAndReturnArgs} args - Arguments to create many Tickets.
     * @example
     * // Create many Tickets
     * const ticket = await prisma.ticket.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tickets and only return the `id`
     * const ticketWithIdOnly = await prisma.ticket.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TicketCreateManyAndReturnArgs>(args?: SelectSubset<T, TicketCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Ticket.
     * @param {TicketDeleteArgs} args - Arguments to delete one Ticket.
     * @example
     * // Delete one Ticket
     * const Ticket = await prisma.ticket.delete({
     *   where: {
     *     // ... filter to delete one Ticket
     *   }
     * })
     * 
     */
    delete<T extends TicketDeleteArgs>(args: SelectSubset<T, TicketDeleteArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Ticket.
     * @param {TicketUpdateArgs} args - Arguments to update one Ticket.
     * @example
     * // Update one Ticket
     * const ticket = await prisma.ticket.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TicketUpdateArgs>(args: SelectSubset<T, TicketUpdateArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tickets.
     * @param {TicketDeleteManyArgs} args - Arguments to filter Tickets to delete.
     * @example
     * // Delete a few Tickets
     * const { count } = await prisma.ticket.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TicketDeleteManyArgs>(args?: SelectSubset<T, TicketDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tickets
     * const ticket = await prisma.ticket.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TicketUpdateManyArgs>(args: SelectSubset<T, TicketUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tickets and returns the data updated in the database.
     * @param {TicketUpdateManyAndReturnArgs} args - Arguments to update many Tickets.
     * @example
     * // Update many Tickets
     * const ticket = await prisma.ticket.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tickets and only return the `id`
     * const ticketWithIdOnly = await prisma.ticket.updateManyAndReturn({
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
    updateManyAndReturn<T extends TicketUpdateManyAndReturnArgs>(args: SelectSubset<T, TicketUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Ticket.
     * @param {TicketUpsertArgs} args - Arguments to update or create a Ticket.
     * @example
     * // Update or create a Ticket
     * const ticket = await prisma.ticket.upsert({
     *   create: {
     *     // ... data to create a Ticket
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ticket we want to update
     *   }
     * })
     */
    upsert<T extends TicketUpsertArgs>(args: SelectSubset<T, TicketUpsertArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketCountArgs} args - Arguments to filter Tickets to count.
     * @example
     * // Count the number of Tickets
     * const count = await prisma.ticket.count({
     *   where: {
     *     // ... the filter for the Tickets we want to count
     *   }
     * })
    **/
    count<T extends TicketCountArgs>(
      args?: Subset<T, TicketCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TicketCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ticket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TicketAggregateArgs>(args: Subset<T, TicketAggregateArgs>): Prisma.PrismaPromise<GetTicketAggregateType<T>>

    /**
     * Group by Ticket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketGroupByArgs} args - Group by arguments.
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
      T extends TicketGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TicketGroupByArgs['orderBy'] }
        : { orderBy?: TicketGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TicketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTicketGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ticket model
   */
  readonly fields: TicketFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ticket.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TicketClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    openedBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    assignedTo<T extends Ticket$assignedToArgs<ExtArgs> = {}>(args?: Subset<T, Ticket$assignedToArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    bugReport<T extends Ticket$bugReportArgs<ExtArgs> = {}>(args?: Subset<T, Ticket$bugReportArgs<ExtArgs>>): Prisma__BugReportClient<$Result.GetResult<Prisma.$BugReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    events<T extends Ticket$eventsArgs<ExtArgs> = {}>(args?: Subset<T, Ticket$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reorderRequests<T extends Ticket$reorderRequestsArgs<ExtArgs> = {}>(args?: Subset<T, Ticket$reorderRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReorderRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends Ticket$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, Ticket$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Ticket model
   */
  interface TicketFieldRefs {
    readonly id: FieldRef<"Ticket", 'String'>
    readonly publicId: FieldRef<"Ticket", 'String'>
    readonly title: FieldRef<"Ticket", 'String'>
    readonly description: FieldRef<"Ticket", 'String'>
    readonly type: FieldRef<"Ticket", 'TicketType'>
    readonly severity: FieldRef<"Ticket", 'Severity'>
    readonly status: FieldRef<"Ticket", 'TicketStatus'>
    readonly deadline: FieldRef<"Ticket", 'DateTime'>
    readonly priorityOrder: FieldRef<"Ticket", 'Int'>
    readonly openedById: FieldRef<"Ticket", 'String'>
    readonly assignedToId: FieldRef<"Ticket", 'String'>
    readonly createdAt: FieldRef<"Ticket", 'DateTime'>
    readonly updatedAt: FieldRef<"Ticket", 'DateTime'>
    readonly resolvedAt: FieldRef<"Ticket", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Ticket findUnique
   */
  export type TicketFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket findUniqueOrThrow
   */
  export type TicketFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket findFirst
   */
  export type TicketFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tickets.
     */
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Ticket findFirstOrThrow
   */
  export type TicketFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tickets.
     */
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Ticket findMany
   */
  export type TicketFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Tickets to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tickets.
     */
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Ticket create
   */
  export type TicketCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * The data needed to create a Ticket.
     */
    data: XOR<TicketCreateInput, TicketUncheckedCreateInput>
  }

  /**
   * Ticket createMany
   */
  export type TicketCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tickets.
     */
    data: TicketCreateManyInput | TicketCreateManyInput[]
  }

  /**
   * Ticket createManyAndReturn
   */
  export type TicketCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * The data used to create many Tickets.
     */
    data: TicketCreateManyInput | TicketCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ticket update
   */
  export type TicketUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * The data needed to update a Ticket.
     */
    data: XOR<TicketUpdateInput, TicketUncheckedUpdateInput>
    /**
     * Choose, which Ticket to update.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket updateMany
   */
  export type TicketUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tickets.
     */
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyInput>
    /**
     * Filter which Tickets to update
     */
    where?: TicketWhereInput
    /**
     * Limit how many Tickets to update.
     */
    limit?: number
  }

  /**
   * Ticket updateManyAndReturn
   */
  export type TicketUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * The data used to update Tickets.
     */
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyInput>
    /**
     * Filter which Tickets to update
     */
    where?: TicketWhereInput
    /**
     * Limit how many Tickets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ticket upsert
   */
  export type TicketUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * The filter to search for the Ticket to update in case it exists.
     */
    where: TicketWhereUniqueInput
    /**
     * In case the Ticket found by the `where` argument doesn't exist, create a new Ticket with this data.
     */
    create: XOR<TicketCreateInput, TicketUncheckedCreateInput>
    /**
     * In case the Ticket was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TicketUpdateInput, TicketUncheckedUpdateInput>
  }

  /**
   * Ticket delete
   */
  export type TicketDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter which Ticket to delete.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket deleteMany
   */
  export type TicketDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tickets to delete
     */
    where?: TicketWhereInput
    /**
     * Limit how many Tickets to delete.
     */
    limit?: number
  }

  /**
   * Ticket.assignedTo
   */
  export type Ticket$assignedToArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Ticket.bugReport
   */
  export type Ticket$bugReportArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BugReport
     */
    select?: BugReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BugReport
     */
    omit?: BugReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BugReportInclude<ExtArgs> | null
    where?: BugReportWhereInput
  }

  /**
   * Ticket.events
   */
  export type Ticket$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketEvent
     */
    select?: TicketEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketEvent
     */
    omit?: TicketEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketEventInclude<ExtArgs> | null
    where?: TicketEventWhereInput
    orderBy?: TicketEventOrderByWithRelationInput | TicketEventOrderByWithRelationInput[]
    cursor?: TicketEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketEventScalarFieldEnum | TicketEventScalarFieldEnum[]
  }

  /**
   * Ticket.reorderRequests
   */
  export type Ticket$reorderRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReorderRequest
     */
    select?: ReorderRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReorderRequest
     */
    omit?: ReorderRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReorderRequestInclude<ExtArgs> | null
    where?: ReorderRequestWhereInput
    orderBy?: ReorderRequestOrderByWithRelationInput | ReorderRequestOrderByWithRelationInput[]
    cursor?: ReorderRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReorderRequestScalarFieldEnum | ReorderRequestScalarFieldEnum[]
  }

  /**
   * Ticket.notifications
   */
  export type Ticket$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Ticket without action
   */
  export type TicketDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
  }


  /**
   * Model BugReport
   */

  export type AggregateBugReport = {
    _count: BugReportCountAggregateOutputType | null
    _min: BugReportMinAggregateOutputType | null
    _max: BugReportMaxAggregateOutputType | null
  }

  export type BugReportMinAggregateOutputType = {
    id: string | null
    ticketId: string | null
    affectedModule: string | null
    stepsToReproduce: string | null
    expectedBehavior: string | null
    actualBehavior: string | null
    environment: $Enums.Environment | null
    customerId: string | null
  }

  export type BugReportMaxAggregateOutputType = {
    id: string | null
    ticketId: string | null
    affectedModule: string | null
    stepsToReproduce: string | null
    expectedBehavior: string | null
    actualBehavior: string | null
    environment: $Enums.Environment | null
    customerId: string | null
  }

  export type BugReportCountAggregateOutputType = {
    id: number
    ticketId: number
    affectedModule: number
    stepsToReproduce: number
    expectedBehavior: number
    actualBehavior: number
    environment: number
    customerId: number
    _all: number
  }


  export type BugReportMinAggregateInputType = {
    id?: true
    ticketId?: true
    affectedModule?: true
    stepsToReproduce?: true
    expectedBehavior?: true
    actualBehavior?: true
    environment?: true
    customerId?: true
  }

  export type BugReportMaxAggregateInputType = {
    id?: true
    ticketId?: true
    affectedModule?: true
    stepsToReproduce?: true
    expectedBehavior?: true
    actualBehavior?: true
    environment?: true
    customerId?: true
  }

  export type BugReportCountAggregateInputType = {
    id?: true
    ticketId?: true
    affectedModule?: true
    stepsToReproduce?: true
    expectedBehavior?: true
    actualBehavior?: true
    environment?: true
    customerId?: true
    _all?: true
  }

  export type BugReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BugReport to aggregate.
     */
    where?: BugReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BugReports to fetch.
     */
    orderBy?: BugReportOrderByWithRelationInput | BugReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BugReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BugReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BugReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BugReports
    **/
    _count?: true | BugReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BugReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BugReportMaxAggregateInputType
  }

  export type GetBugReportAggregateType<T extends BugReportAggregateArgs> = {
        [P in keyof T & keyof AggregateBugReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBugReport[P]>
      : GetScalarType<T[P], AggregateBugReport[P]>
  }




  export type BugReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BugReportWhereInput
    orderBy?: BugReportOrderByWithAggregationInput | BugReportOrderByWithAggregationInput[]
    by: BugReportScalarFieldEnum[] | BugReportScalarFieldEnum
    having?: BugReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BugReportCountAggregateInputType | true
    _min?: BugReportMinAggregateInputType
    _max?: BugReportMaxAggregateInputType
  }

  export type BugReportGroupByOutputType = {
    id: string
    ticketId: string
    affectedModule: string
    stepsToReproduce: string
    expectedBehavior: string
    actualBehavior: string
    environment: $Enums.Environment
    customerId: string | null
    _count: BugReportCountAggregateOutputType | null
    _min: BugReportMinAggregateOutputType | null
    _max: BugReportMaxAggregateOutputType | null
  }

  type GetBugReportGroupByPayload<T extends BugReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BugReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BugReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BugReportGroupByOutputType[P]>
            : GetScalarType<T[P], BugReportGroupByOutputType[P]>
        }
      >
    >


  export type BugReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    affectedModule?: boolean
    stepsToReproduce?: boolean
    expectedBehavior?: boolean
    actualBehavior?: boolean
    environment?: boolean
    customerId?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bugReport"]>

  export type BugReportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    affectedModule?: boolean
    stepsToReproduce?: boolean
    expectedBehavior?: boolean
    actualBehavior?: boolean
    environment?: boolean
    customerId?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bugReport"]>

  export type BugReportSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    affectedModule?: boolean
    stepsToReproduce?: boolean
    expectedBehavior?: boolean
    actualBehavior?: boolean
    environment?: boolean
    customerId?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bugReport"]>

  export type BugReportSelectScalar = {
    id?: boolean
    ticketId?: boolean
    affectedModule?: boolean
    stepsToReproduce?: boolean
    expectedBehavior?: boolean
    actualBehavior?: boolean
    environment?: boolean
    customerId?: boolean
  }

  export type BugReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ticketId" | "affectedModule" | "stepsToReproduce" | "expectedBehavior" | "actualBehavior" | "environment" | "customerId", ExtArgs["result"]["bugReport"]>
  export type BugReportInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
  }
  export type BugReportIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
  }
  export type BugReportIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
  }

  export type $BugReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BugReport"
    objects: {
      ticket: Prisma.$TicketPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ticketId: string
      affectedModule: string
      stepsToReproduce: string
      expectedBehavior: string
      actualBehavior: string
      environment: $Enums.Environment
      customerId: string | null
    }, ExtArgs["result"]["bugReport"]>
    composites: {}
  }

  type BugReportGetPayload<S extends boolean | null | undefined | BugReportDefaultArgs> = $Result.GetResult<Prisma.$BugReportPayload, S>

  type BugReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BugReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BugReportCountAggregateInputType | true
    }

  export interface BugReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BugReport'], meta: { name: 'BugReport' } }
    /**
     * Find zero or one BugReport that matches the filter.
     * @param {BugReportFindUniqueArgs} args - Arguments to find a BugReport
     * @example
     * // Get one BugReport
     * const bugReport = await prisma.bugReport.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BugReportFindUniqueArgs>(args: SelectSubset<T, BugReportFindUniqueArgs<ExtArgs>>): Prisma__BugReportClient<$Result.GetResult<Prisma.$BugReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BugReport that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BugReportFindUniqueOrThrowArgs} args - Arguments to find a BugReport
     * @example
     * // Get one BugReport
     * const bugReport = await prisma.bugReport.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BugReportFindUniqueOrThrowArgs>(args: SelectSubset<T, BugReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BugReportClient<$Result.GetResult<Prisma.$BugReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BugReport that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BugReportFindFirstArgs} args - Arguments to find a BugReport
     * @example
     * // Get one BugReport
     * const bugReport = await prisma.bugReport.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BugReportFindFirstArgs>(args?: SelectSubset<T, BugReportFindFirstArgs<ExtArgs>>): Prisma__BugReportClient<$Result.GetResult<Prisma.$BugReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BugReport that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BugReportFindFirstOrThrowArgs} args - Arguments to find a BugReport
     * @example
     * // Get one BugReport
     * const bugReport = await prisma.bugReport.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BugReportFindFirstOrThrowArgs>(args?: SelectSubset<T, BugReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__BugReportClient<$Result.GetResult<Prisma.$BugReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BugReports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BugReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BugReports
     * const bugReports = await prisma.bugReport.findMany()
     * 
     * // Get first 10 BugReports
     * const bugReports = await prisma.bugReport.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bugReportWithIdOnly = await prisma.bugReport.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BugReportFindManyArgs>(args?: SelectSubset<T, BugReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BugReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BugReport.
     * @param {BugReportCreateArgs} args - Arguments to create a BugReport.
     * @example
     * // Create one BugReport
     * const BugReport = await prisma.bugReport.create({
     *   data: {
     *     // ... data to create a BugReport
     *   }
     * })
     * 
     */
    create<T extends BugReportCreateArgs>(args: SelectSubset<T, BugReportCreateArgs<ExtArgs>>): Prisma__BugReportClient<$Result.GetResult<Prisma.$BugReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BugReports.
     * @param {BugReportCreateManyArgs} args - Arguments to create many BugReports.
     * @example
     * // Create many BugReports
     * const bugReport = await prisma.bugReport.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BugReportCreateManyArgs>(args?: SelectSubset<T, BugReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BugReports and returns the data saved in the database.
     * @param {BugReportCreateManyAndReturnArgs} args - Arguments to create many BugReports.
     * @example
     * // Create many BugReports
     * const bugReport = await prisma.bugReport.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BugReports and only return the `id`
     * const bugReportWithIdOnly = await prisma.bugReport.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BugReportCreateManyAndReturnArgs>(args?: SelectSubset<T, BugReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BugReportPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BugReport.
     * @param {BugReportDeleteArgs} args - Arguments to delete one BugReport.
     * @example
     * // Delete one BugReport
     * const BugReport = await prisma.bugReport.delete({
     *   where: {
     *     // ... filter to delete one BugReport
     *   }
     * })
     * 
     */
    delete<T extends BugReportDeleteArgs>(args: SelectSubset<T, BugReportDeleteArgs<ExtArgs>>): Prisma__BugReportClient<$Result.GetResult<Prisma.$BugReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BugReport.
     * @param {BugReportUpdateArgs} args - Arguments to update one BugReport.
     * @example
     * // Update one BugReport
     * const bugReport = await prisma.bugReport.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BugReportUpdateArgs>(args: SelectSubset<T, BugReportUpdateArgs<ExtArgs>>): Prisma__BugReportClient<$Result.GetResult<Prisma.$BugReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BugReports.
     * @param {BugReportDeleteManyArgs} args - Arguments to filter BugReports to delete.
     * @example
     * // Delete a few BugReports
     * const { count } = await prisma.bugReport.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BugReportDeleteManyArgs>(args?: SelectSubset<T, BugReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BugReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BugReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BugReports
     * const bugReport = await prisma.bugReport.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BugReportUpdateManyArgs>(args: SelectSubset<T, BugReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BugReports and returns the data updated in the database.
     * @param {BugReportUpdateManyAndReturnArgs} args - Arguments to update many BugReports.
     * @example
     * // Update many BugReports
     * const bugReport = await prisma.bugReport.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BugReports and only return the `id`
     * const bugReportWithIdOnly = await prisma.bugReport.updateManyAndReturn({
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
    updateManyAndReturn<T extends BugReportUpdateManyAndReturnArgs>(args: SelectSubset<T, BugReportUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BugReportPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BugReport.
     * @param {BugReportUpsertArgs} args - Arguments to update or create a BugReport.
     * @example
     * // Update or create a BugReport
     * const bugReport = await prisma.bugReport.upsert({
     *   create: {
     *     // ... data to create a BugReport
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BugReport we want to update
     *   }
     * })
     */
    upsert<T extends BugReportUpsertArgs>(args: SelectSubset<T, BugReportUpsertArgs<ExtArgs>>): Prisma__BugReportClient<$Result.GetResult<Prisma.$BugReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BugReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BugReportCountArgs} args - Arguments to filter BugReports to count.
     * @example
     * // Count the number of BugReports
     * const count = await prisma.bugReport.count({
     *   where: {
     *     // ... the filter for the BugReports we want to count
     *   }
     * })
    **/
    count<T extends BugReportCountArgs>(
      args?: Subset<T, BugReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BugReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BugReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BugReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BugReportAggregateArgs>(args: Subset<T, BugReportAggregateArgs>): Prisma.PrismaPromise<GetBugReportAggregateType<T>>

    /**
     * Group by BugReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BugReportGroupByArgs} args - Group by arguments.
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
      T extends BugReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BugReportGroupByArgs['orderBy'] }
        : { orderBy?: BugReportGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BugReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBugReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BugReport model
   */
  readonly fields: BugReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BugReport.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BugReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ticket<T extends TicketDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TicketDefaultArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the BugReport model
   */
  interface BugReportFieldRefs {
    readonly id: FieldRef<"BugReport", 'String'>
    readonly ticketId: FieldRef<"BugReport", 'String'>
    readonly affectedModule: FieldRef<"BugReport", 'String'>
    readonly stepsToReproduce: FieldRef<"BugReport", 'String'>
    readonly expectedBehavior: FieldRef<"BugReport", 'String'>
    readonly actualBehavior: FieldRef<"BugReport", 'String'>
    readonly environment: FieldRef<"BugReport", 'Environment'>
    readonly customerId: FieldRef<"BugReport", 'String'>
  }
    

  // Custom InputTypes
  /**
   * BugReport findUnique
   */
  export type BugReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BugReport
     */
    select?: BugReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BugReport
     */
    omit?: BugReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BugReportInclude<ExtArgs> | null
    /**
     * Filter, which BugReport to fetch.
     */
    where: BugReportWhereUniqueInput
  }

  /**
   * BugReport findUniqueOrThrow
   */
  export type BugReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BugReport
     */
    select?: BugReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BugReport
     */
    omit?: BugReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BugReportInclude<ExtArgs> | null
    /**
     * Filter, which BugReport to fetch.
     */
    where: BugReportWhereUniqueInput
  }

  /**
   * BugReport findFirst
   */
  export type BugReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BugReport
     */
    select?: BugReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BugReport
     */
    omit?: BugReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BugReportInclude<ExtArgs> | null
    /**
     * Filter, which BugReport to fetch.
     */
    where?: BugReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BugReports to fetch.
     */
    orderBy?: BugReportOrderByWithRelationInput | BugReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BugReports.
     */
    cursor?: BugReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BugReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BugReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BugReports.
     */
    distinct?: BugReportScalarFieldEnum | BugReportScalarFieldEnum[]
  }

  /**
   * BugReport findFirstOrThrow
   */
  export type BugReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BugReport
     */
    select?: BugReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BugReport
     */
    omit?: BugReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BugReportInclude<ExtArgs> | null
    /**
     * Filter, which BugReport to fetch.
     */
    where?: BugReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BugReports to fetch.
     */
    orderBy?: BugReportOrderByWithRelationInput | BugReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BugReports.
     */
    cursor?: BugReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BugReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BugReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BugReports.
     */
    distinct?: BugReportScalarFieldEnum | BugReportScalarFieldEnum[]
  }

  /**
   * BugReport findMany
   */
  export type BugReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BugReport
     */
    select?: BugReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BugReport
     */
    omit?: BugReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BugReportInclude<ExtArgs> | null
    /**
     * Filter, which BugReports to fetch.
     */
    where?: BugReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BugReports to fetch.
     */
    orderBy?: BugReportOrderByWithRelationInput | BugReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BugReports.
     */
    cursor?: BugReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BugReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BugReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BugReports.
     */
    distinct?: BugReportScalarFieldEnum | BugReportScalarFieldEnum[]
  }

  /**
   * BugReport create
   */
  export type BugReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BugReport
     */
    select?: BugReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BugReport
     */
    omit?: BugReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BugReportInclude<ExtArgs> | null
    /**
     * The data needed to create a BugReport.
     */
    data: XOR<BugReportCreateInput, BugReportUncheckedCreateInput>
  }

  /**
   * BugReport createMany
   */
  export type BugReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BugReports.
     */
    data: BugReportCreateManyInput | BugReportCreateManyInput[]
  }

  /**
   * BugReport createManyAndReturn
   */
  export type BugReportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BugReport
     */
    select?: BugReportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BugReport
     */
    omit?: BugReportOmit<ExtArgs> | null
    /**
     * The data used to create many BugReports.
     */
    data: BugReportCreateManyInput | BugReportCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BugReportIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BugReport update
   */
  export type BugReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BugReport
     */
    select?: BugReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BugReport
     */
    omit?: BugReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BugReportInclude<ExtArgs> | null
    /**
     * The data needed to update a BugReport.
     */
    data: XOR<BugReportUpdateInput, BugReportUncheckedUpdateInput>
    /**
     * Choose, which BugReport to update.
     */
    where: BugReportWhereUniqueInput
  }

  /**
   * BugReport updateMany
   */
  export type BugReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BugReports.
     */
    data: XOR<BugReportUpdateManyMutationInput, BugReportUncheckedUpdateManyInput>
    /**
     * Filter which BugReports to update
     */
    where?: BugReportWhereInput
    /**
     * Limit how many BugReports to update.
     */
    limit?: number
  }

  /**
   * BugReport updateManyAndReturn
   */
  export type BugReportUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BugReport
     */
    select?: BugReportSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BugReport
     */
    omit?: BugReportOmit<ExtArgs> | null
    /**
     * The data used to update BugReports.
     */
    data: XOR<BugReportUpdateManyMutationInput, BugReportUncheckedUpdateManyInput>
    /**
     * Filter which BugReports to update
     */
    where?: BugReportWhereInput
    /**
     * Limit how many BugReports to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BugReportIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BugReport upsert
   */
  export type BugReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BugReport
     */
    select?: BugReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BugReport
     */
    omit?: BugReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BugReportInclude<ExtArgs> | null
    /**
     * The filter to search for the BugReport to update in case it exists.
     */
    where: BugReportWhereUniqueInput
    /**
     * In case the BugReport found by the `where` argument doesn't exist, create a new BugReport with this data.
     */
    create: XOR<BugReportCreateInput, BugReportUncheckedCreateInput>
    /**
     * In case the BugReport was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BugReportUpdateInput, BugReportUncheckedUpdateInput>
  }

  /**
   * BugReport delete
   */
  export type BugReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BugReport
     */
    select?: BugReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BugReport
     */
    omit?: BugReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BugReportInclude<ExtArgs> | null
    /**
     * Filter which BugReport to delete.
     */
    where: BugReportWhereUniqueInput
  }

  /**
   * BugReport deleteMany
   */
  export type BugReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BugReports to delete
     */
    where?: BugReportWhereInput
    /**
     * Limit how many BugReports to delete.
     */
    limit?: number
  }

  /**
   * BugReport without action
   */
  export type BugReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BugReport
     */
    select?: BugReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BugReport
     */
    omit?: BugReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BugReportInclude<ExtArgs> | null
  }


  /**
   * Model TicketEvent
   */

  export type AggregateTicketEvent = {
    _count: TicketEventCountAggregateOutputType | null
    _min: TicketEventMinAggregateOutputType | null
    _max: TicketEventMaxAggregateOutputType | null
  }

  export type TicketEventMinAggregateOutputType = {
    id: string | null
    ticketId: string | null
    eventType: $Enums.TicketEventType | null
    actorId: string | null
    metadata: string | null
    createdAt: Date | null
  }

  export type TicketEventMaxAggregateOutputType = {
    id: string | null
    ticketId: string | null
    eventType: $Enums.TicketEventType | null
    actorId: string | null
    metadata: string | null
    createdAt: Date | null
  }

  export type TicketEventCountAggregateOutputType = {
    id: number
    ticketId: number
    eventType: number
    actorId: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type TicketEventMinAggregateInputType = {
    id?: true
    ticketId?: true
    eventType?: true
    actorId?: true
    metadata?: true
    createdAt?: true
  }

  export type TicketEventMaxAggregateInputType = {
    id?: true
    ticketId?: true
    eventType?: true
    actorId?: true
    metadata?: true
    createdAt?: true
  }

  export type TicketEventCountAggregateInputType = {
    id?: true
    ticketId?: true
    eventType?: true
    actorId?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type TicketEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TicketEvent to aggregate.
     */
    where?: TicketEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketEvents to fetch.
     */
    orderBy?: TicketEventOrderByWithRelationInput | TicketEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TicketEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TicketEvents
    **/
    _count?: true | TicketEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TicketEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TicketEventMaxAggregateInputType
  }

  export type GetTicketEventAggregateType<T extends TicketEventAggregateArgs> = {
        [P in keyof T & keyof AggregateTicketEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTicketEvent[P]>
      : GetScalarType<T[P], AggregateTicketEvent[P]>
  }




  export type TicketEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketEventWhereInput
    orderBy?: TicketEventOrderByWithAggregationInput | TicketEventOrderByWithAggregationInput[]
    by: TicketEventScalarFieldEnum[] | TicketEventScalarFieldEnum
    having?: TicketEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TicketEventCountAggregateInputType | true
    _min?: TicketEventMinAggregateInputType
    _max?: TicketEventMaxAggregateInputType
  }

  export type TicketEventGroupByOutputType = {
    id: string
    ticketId: string
    eventType: $Enums.TicketEventType
    actorId: string
    metadata: string
    createdAt: Date
    _count: TicketEventCountAggregateOutputType | null
    _min: TicketEventMinAggregateOutputType | null
    _max: TicketEventMaxAggregateOutputType | null
  }

  type GetTicketEventGroupByPayload<T extends TicketEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TicketEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TicketEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TicketEventGroupByOutputType[P]>
            : GetScalarType<T[P], TicketEventGroupByOutputType[P]>
        }
      >
    >


  export type TicketEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    eventType?: boolean
    actorId?: boolean
    metadata?: boolean
    createdAt?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    actor?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticketEvent"]>

  export type TicketEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    eventType?: boolean
    actorId?: boolean
    metadata?: boolean
    createdAt?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    actor?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticketEvent"]>

  export type TicketEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    eventType?: boolean
    actorId?: boolean
    metadata?: boolean
    createdAt?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    actor?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticketEvent"]>

  export type TicketEventSelectScalar = {
    id?: boolean
    ticketId?: boolean
    eventType?: boolean
    actorId?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type TicketEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ticketId" | "eventType" | "actorId" | "metadata" | "createdAt", ExtArgs["result"]["ticketEvent"]>
  export type TicketEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    actor?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TicketEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    actor?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TicketEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    actor?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TicketEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TicketEvent"
    objects: {
      ticket: Prisma.$TicketPayload<ExtArgs>
      actor: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ticketId: string
      eventType: $Enums.TicketEventType
      actorId: string
      metadata: string
      createdAt: Date
    }, ExtArgs["result"]["ticketEvent"]>
    composites: {}
  }

  type TicketEventGetPayload<S extends boolean | null | undefined | TicketEventDefaultArgs> = $Result.GetResult<Prisma.$TicketEventPayload, S>

  type TicketEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TicketEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TicketEventCountAggregateInputType | true
    }

  export interface TicketEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TicketEvent'], meta: { name: 'TicketEvent' } }
    /**
     * Find zero or one TicketEvent that matches the filter.
     * @param {TicketEventFindUniqueArgs} args - Arguments to find a TicketEvent
     * @example
     * // Get one TicketEvent
     * const ticketEvent = await prisma.ticketEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TicketEventFindUniqueArgs>(args: SelectSubset<T, TicketEventFindUniqueArgs<ExtArgs>>): Prisma__TicketEventClient<$Result.GetResult<Prisma.$TicketEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TicketEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TicketEventFindUniqueOrThrowArgs} args - Arguments to find a TicketEvent
     * @example
     * // Get one TicketEvent
     * const ticketEvent = await prisma.ticketEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TicketEventFindUniqueOrThrowArgs>(args: SelectSubset<T, TicketEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TicketEventClient<$Result.GetResult<Prisma.$TicketEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TicketEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketEventFindFirstArgs} args - Arguments to find a TicketEvent
     * @example
     * // Get one TicketEvent
     * const ticketEvent = await prisma.ticketEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TicketEventFindFirstArgs>(args?: SelectSubset<T, TicketEventFindFirstArgs<ExtArgs>>): Prisma__TicketEventClient<$Result.GetResult<Prisma.$TicketEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TicketEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketEventFindFirstOrThrowArgs} args - Arguments to find a TicketEvent
     * @example
     * // Get one TicketEvent
     * const ticketEvent = await prisma.ticketEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TicketEventFindFirstOrThrowArgs>(args?: SelectSubset<T, TicketEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__TicketEventClient<$Result.GetResult<Prisma.$TicketEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TicketEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TicketEvents
     * const ticketEvents = await prisma.ticketEvent.findMany()
     * 
     * // Get first 10 TicketEvents
     * const ticketEvents = await prisma.ticketEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ticketEventWithIdOnly = await prisma.ticketEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TicketEventFindManyArgs>(args?: SelectSubset<T, TicketEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TicketEvent.
     * @param {TicketEventCreateArgs} args - Arguments to create a TicketEvent.
     * @example
     * // Create one TicketEvent
     * const TicketEvent = await prisma.ticketEvent.create({
     *   data: {
     *     // ... data to create a TicketEvent
     *   }
     * })
     * 
     */
    create<T extends TicketEventCreateArgs>(args: SelectSubset<T, TicketEventCreateArgs<ExtArgs>>): Prisma__TicketEventClient<$Result.GetResult<Prisma.$TicketEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TicketEvents.
     * @param {TicketEventCreateManyArgs} args - Arguments to create many TicketEvents.
     * @example
     * // Create many TicketEvents
     * const ticketEvent = await prisma.ticketEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TicketEventCreateManyArgs>(args?: SelectSubset<T, TicketEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TicketEvents and returns the data saved in the database.
     * @param {TicketEventCreateManyAndReturnArgs} args - Arguments to create many TicketEvents.
     * @example
     * // Create many TicketEvents
     * const ticketEvent = await prisma.ticketEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TicketEvents and only return the `id`
     * const ticketEventWithIdOnly = await prisma.ticketEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TicketEventCreateManyAndReturnArgs>(args?: SelectSubset<T, TicketEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TicketEvent.
     * @param {TicketEventDeleteArgs} args - Arguments to delete one TicketEvent.
     * @example
     * // Delete one TicketEvent
     * const TicketEvent = await prisma.ticketEvent.delete({
     *   where: {
     *     // ... filter to delete one TicketEvent
     *   }
     * })
     * 
     */
    delete<T extends TicketEventDeleteArgs>(args: SelectSubset<T, TicketEventDeleteArgs<ExtArgs>>): Prisma__TicketEventClient<$Result.GetResult<Prisma.$TicketEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TicketEvent.
     * @param {TicketEventUpdateArgs} args - Arguments to update one TicketEvent.
     * @example
     * // Update one TicketEvent
     * const ticketEvent = await prisma.ticketEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TicketEventUpdateArgs>(args: SelectSubset<T, TicketEventUpdateArgs<ExtArgs>>): Prisma__TicketEventClient<$Result.GetResult<Prisma.$TicketEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TicketEvents.
     * @param {TicketEventDeleteManyArgs} args - Arguments to filter TicketEvents to delete.
     * @example
     * // Delete a few TicketEvents
     * const { count } = await prisma.ticketEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TicketEventDeleteManyArgs>(args?: SelectSubset<T, TicketEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TicketEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TicketEvents
     * const ticketEvent = await prisma.ticketEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TicketEventUpdateManyArgs>(args: SelectSubset<T, TicketEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TicketEvents and returns the data updated in the database.
     * @param {TicketEventUpdateManyAndReturnArgs} args - Arguments to update many TicketEvents.
     * @example
     * // Update many TicketEvents
     * const ticketEvent = await prisma.ticketEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TicketEvents and only return the `id`
     * const ticketEventWithIdOnly = await prisma.ticketEvent.updateManyAndReturn({
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
    updateManyAndReturn<T extends TicketEventUpdateManyAndReturnArgs>(args: SelectSubset<T, TicketEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TicketEvent.
     * @param {TicketEventUpsertArgs} args - Arguments to update or create a TicketEvent.
     * @example
     * // Update or create a TicketEvent
     * const ticketEvent = await prisma.ticketEvent.upsert({
     *   create: {
     *     // ... data to create a TicketEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TicketEvent we want to update
     *   }
     * })
     */
    upsert<T extends TicketEventUpsertArgs>(args: SelectSubset<T, TicketEventUpsertArgs<ExtArgs>>): Prisma__TicketEventClient<$Result.GetResult<Prisma.$TicketEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TicketEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketEventCountArgs} args - Arguments to filter TicketEvents to count.
     * @example
     * // Count the number of TicketEvents
     * const count = await prisma.ticketEvent.count({
     *   where: {
     *     // ... the filter for the TicketEvents we want to count
     *   }
     * })
    **/
    count<T extends TicketEventCountArgs>(
      args?: Subset<T, TicketEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TicketEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TicketEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TicketEventAggregateArgs>(args: Subset<T, TicketEventAggregateArgs>): Prisma.PrismaPromise<GetTicketEventAggregateType<T>>

    /**
     * Group by TicketEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketEventGroupByArgs} args - Group by arguments.
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
      T extends TicketEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TicketEventGroupByArgs['orderBy'] }
        : { orderBy?: TicketEventGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TicketEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTicketEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TicketEvent model
   */
  readonly fields: TicketEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TicketEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TicketEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ticket<T extends TicketDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TicketDefaultArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    actor<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the TicketEvent model
   */
  interface TicketEventFieldRefs {
    readonly id: FieldRef<"TicketEvent", 'String'>
    readonly ticketId: FieldRef<"TicketEvent", 'String'>
    readonly eventType: FieldRef<"TicketEvent", 'TicketEventType'>
    readonly actorId: FieldRef<"TicketEvent", 'String'>
    readonly metadata: FieldRef<"TicketEvent", 'String'>
    readonly createdAt: FieldRef<"TicketEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TicketEvent findUnique
   */
  export type TicketEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketEvent
     */
    select?: TicketEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketEvent
     */
    omit?: TicketEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketEventInclude<ExtArgs> | null
    /**
     * Filter, which TicketEvent to fetch.
     */
    where: TicketEventWhereUniqueInput
  }

  /**
   * TicketEvent findUniqueOrThrow
   */
  export type TicketEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketEvent
     */
    select?: TicketEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketEvent
     */
    omit?: TicketEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketEventInclude<ExtArgs> | null
    /**
     * Filter, which TicketEvent to fetch.
     */
    where: TicketEventWhereUniqueInput
  }

  /**
   * TicketEvent findFirst
   */
  export type TicketEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketEvent
     */
    select?: TicketEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketEvent
     */
    omit?: TicketEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketEventInclude<ExtArgs> | null
    /**
     * Filter, which TicketEvent to fetch.
     */
    where?: TicketEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketEvents to fetch.
     */
    orderBy?: TicketEventOrderByWithRelationInput | TicketEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TicketEvents.
     */
    cursor?: TicketEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketEvents.
     */
    distinct?: TicketEventScalarFieldEnum | TicketEventScalarFieldEnum[]
  }

  /**
   * TicketEvent findFirstOrThrow
   */
  export type TicketEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketEvent
     */
    select?: TicketEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketEvent
     */
    omit?: TicketEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketEventInclude<ExtArgs> | null
    /**
     * Filter, which TicketEvent to fetch.
     */
    where?: TicketEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketEvents to fetch.
     */
    orderBy?: TicketEventOrderByWithRelationInput | TicketEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TicketEvents.
     */
    cursor?: TicketEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketEvents.
     */
    distinct?: TicketEventScalarFieldEnum | TicketEventScalarFieldEnum[]
  }

  /**
   * TicketEvent findMany
   */
  export type TicketEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketEvent
     */
    select?: TicketEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketEvent
     */
    omit?: TicketEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketEventInclude<ExtArgs> | null
    /**
     * Filter, which TicketEvents to fetch.
     */
    where?: TicketEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketEvents to fetch.
     */
    orderBy?: TicketEventOrderByWithRelationInput | TicketEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TicketEvents.
     */
    cursor?: TicketEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketEvents.
     */
    distinct?: TicketEventScalarFieldEnum | TicketEventScalarFieldEnum[]
  }

  /**
   * TicketEvent create
   */
  export type TicketEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketEvent
     */
    select?: TicketEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketEvent
     */
    omit?: TicketEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketEventInclude<ExtArgs> | null
    /**
     * The data needed to create a TicketEvent.
     */
    data: XOR<TicketEventCreateInput, TicketEventUncheckedCreateInput>
  }

  /**
   * TicketEvent createMany
   */
  export type TicketEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TicketEvents.
     */
    data: TicketEventCreateManyInput | TicketEventCreateManyInput[]
  }

  /**
   * TicketEvent createManyAndReturn
   */
  export type TicketEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketEvent
     */
    select?: TicketEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TicketEvent
     */
    omit?: TicketEventOmit<ExtArgs> | null
    /**
     * The data used to create many TicketEvents.
     */
    data: TicketEventCreateManyInput | TicketEventCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TicketEvent update
   */
  export type TicketEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketEvent
     */
    select?: TicketEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketEvent
     */
    omit?: TicketEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketEventInclude<ExtArgs> | null
    /**
     * The data needed to update a TicketEvent.
     */
    data: XOR<TicketEventUpdateInput, TicketEventUncheckedUpdateInput>
    /**
     * Choose, which TicketEvent to update.
     */
    where: TicketEventWhereUniqueInput
  }

  /**
   * TicketEvent updateMany
   */
  export type TicketEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TicketEvents.
     */
    data: XOR<TicketEventUpdateManyMutationInput, TicketEventUncheckedUpdateManyInput>
    /**
     * Filter which TicketEvents to update
     */
    where?: TicketEventWhereInput
    /**
     * Limit how many TicketEvents to update.
     */
    limit?: number
  }

  /**
   * TicketEvent updateManyAndReturn
   */
  export type TicketEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketEvent
     */
    select?: TicketEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TicketEvent
     */
    omit?: TicketEventOmit<ExtArgs> | null
    /**
     * The data used to update TicketEvents.
     */
    data: XOR<TicketEventUpdateManyMutationInput, TicketEventUncheckedUpdateManyInput>
    /**
     * Filter which TicketEvents to update
     */
    where?: TicketEventWhereInput
    /**
     * Limit how many TicketEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TicketEvent upsert
   */
  export type TicketEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketEvent
     */
    select?: TicketEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketEvent
     */
    omit?: TicketEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketEventInclude<ExtArgs> | null
    /**
     * The filter to search for the TicketEvent to update in case it exists.
     */
    where: TicketEventWhereUniqueInput
    /**
     * In case the TicketEvent found by the `where` argument doesn't exist, create a new TicketEvent with this data.
     */
    create: XOR<TicketEventCreateInput, TicketEventUncheckedCreateInput>
    /**
     * In case the TicketEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TicketEventUpdateInput, TicketEventUncheckedUpdateInput>
  }

  /**
   * TicketEvent delete
   */
  export type TicketEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketEvent
     */
    select?: TicketEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketEvent
     */
    omit?: TicketEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketEventInclude<ExtArgs> | null
    /**
     * Filter which TicketEvent to delete.
     */
    where: TicketEventWhereUniqueInput
  }

  /**
   * TicketEvent deleteMany
   */
  export type TicketEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TicketEvents to delete
     */
    where?: TicketEventWhereInput
    /**
     * Limit how many TicketEvents to delete.
     */
    limit?: number
  }

  /**
   * TicketEvent without action
   */
  export type TicketEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketEvent
     */
    select?: TicketEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketEvent
     */
    omit?: TicketEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketEventInclude<ExtArgs> | null
  }


  /**
   * Model ReorderRequest
   */

  export type AggregateReorderRequest = {
    _count: ReorderRequestCountAggregateOutputType | null
    _avg: ReorderRequestAvgAggregateOutputType | null
    _sum: ReorderRequestSumAggregateOutputType | null
    _min: ReorderRequestMinAggregateOutputType | null
    _max: ReorderRequestMaxAggregateOutputType | null
  }

  export type ReorderRequestAvgAggregateOutputType = {
    requestedPosition: number | null
  }

  export type ReorderRequestSumAggregateOutputType = {
    requestedPosition: number | null
  }

  export type ReorderRequestMinAggregateOutputType = {
    id: string | null
    ticketId: string | null
    requestedById: string | null
    requestedPosition: number | null
    reason: string | null
    status: $Enums.ReorderStatus | null
    resolvedById: string | null
    resolvedAt: Date | null
    createdAt: Date | null
  }

  export type ReorderRequestMaxAggregateOutputType = {
    id: string | null
    ticketId: string | null
    requestedById: string | null
    requestedPosition: number | null
    reason: string | null
    status: $Enums.ReorderStatus | null
    resolvedById: string | null
    resolvedAt: Date | null
    createdAt: Date | null
  }

  export type ReorderRequestCountAggregateOutputType = {
    id: number
    ticketId: number
    requestedById: number
    requestedPosition: number
    reason: number
    status: number
    resolvedById: number
    resolvedAt: number
    createdAt: number
    _all: number
  }


  export type ReorderRequestAvgAggregateInputType = {
    requestedPosition?: true
  }

  export type ReorderRequestSumAggregateInputType = {
    requestedPosition?: true
  }

  export type ReorderRequestMinAggregateInputType = {
    id?: true
    ticketId?: true
    requestedById?: true
    requestedPosition?: true
    reason?: true
    status?: true
    resolvedById?: true
    resolvedAt?: true
    createdAt?: true
  }

  export type ReorderRequestMaxAggregateInputType = {
    id?: true
    ticketId?: true
    requestedById?: true
    requestedPosition?: true
    reason?: true
    status?: true
    resolvedById?: true
    resolvedAt?: true
    createdAt?: true
  }

  export type ReorderRequestCountAggregateInputType = {
    id?: true
    ticketId?: true
    requestedById?: true
    requestedPosition?: true
    reason?: true
    status?: true
    resolvedById?: true
    resolvedAt?: true
    createdAt?: true
    _all?: true
  }

  export type ReorderRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReorderRequest to aggregate.
     */
    where?: ReorderRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReorderRequests to fetch.
     */
    orderBy?: ReorderRequestOrderByWithRelationInput | ReorderRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReorderRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReorderRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReorderRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReorderRequests
    **/
    _count?: true | ReorderRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReorderRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReorderRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReorderRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReorderRequestMaxAggregateInputType
  }

  export type GetReorderRequestAggregateType<T extends ReorderRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateReorderRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReorderRequest[P]>
      : GetScalarType<T[P], AggregateReorderRequest[P]>
  }




  export type ReorderRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReorderRequestWhereInput
    orderBy?: ReorderRequestOrderByWithAggregationInput | ReorderRequestOrderByWithAggregationInput[]
    by: ReorderRequestScalarFieldEnum[] | ReorderRequestScalarFieldEnum
    having?: ReorderRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReorderRequestCountAggregateInputType | true
    _avg?: ReorderRequestAvgAggregateInputType
    _sum?: ReorderRequestSumAggregateInputType
    _min?: ReorderRequestMinAggregateInputType
    _max?: ReorderRequestMaxAggregateInputType
  }

  export type ReorderRequestGroupByOutputType = {
    id: string
    ticketId: string
    requestedById: string
    requestedPosition: number
    reason: string | null
    status: $Enums.ReorderStatus
    resolvedById: string | null
    resolvedAt: Date | null
    createdAt: Date
    _count: ReorderRequestCountAggregateOutputType | null
    _avg: ReorderRequestAvgAggregateOutputType | null
    _sum: ReorderRequestSumAggregateOutputType | null
    _min: ReorderRequestMinAggregateOutputType | null
    _max: ReorderRequestMaxAggregateOutputType | null
  }

  type GetReorderRequestGroupByPayload<T extends ReorderRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReorderRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReorderRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReorderRequestGroupByOutputType[P]>
            : GetScalarType<T[P], ReorderRequestGroupByOutputType[P]>
        }
      >
    >


  export type ReorderRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    requestedById?: boolean
    requestedPosition?: boolean
    reason?: boolean
    status?: boolean
    resolvedById?: boolean
    resolvedAt?: boolean
    createdAt?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    requestedBy?: boolean | UserDefaultArgs<ExtArgs>
    resolvedBy?: boolean | ReorderRequest$resolvedByArgs<ExtArgs>
  }, ExtArgs["result"]["reorderRequest"]>

  export type ReorderRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    requestedById?: boolean
    requestedPosition?: boolean
    reason?: boolean
    status?: boolean
    resolvedById?: boolean
    resolvedAt?: boolean
    createdAt?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    requestedBy?: boolean | UserDefaultArgs<ExtArgs>
    resolvedBy?: boolean | ReorderRequest$resolvedByArgs<ExtArgs>
  }, ExtArgs["result"]["reorderRequest"]>

  export type ReorderRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    requestedById?: boolean
    requestedPosition?: boolean
    reason?: boolean
    status?: boolean
    resolvedById?: boolean
    resolvedAt?: boolean
    createdAt?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    requestedBy?: boolean | UserDefaultArgs<ExtArgs>
    resolvedBy?: boolean | ReorderRequest$resolvedByArgs<ExtArgs>
  }, ExtArgs["result"]["reorderRequest"]>

  export type ReorderRequestSelectScalar = {
    id?: boolean
    ticketId?: boolean
    requestedById?: boolean
    requestedPosition?: boolean
    reason?: boolean
    status?: boolean
    resolvedById?: boolean
    resolvedAt?: boolean
    createdAt?: boolean
  }

  export type ReorderRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ticketId" | "requestedById" | "requestedPosition" | "reason" | "status" | "resolvedById" | "resolvedAt" | "createdAt", ExtArgs["result"]["reorderRequest"]>
  export type ReorderRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    requestedBy?: boolean | UserDefaultArgs<ExtArgs>
    resolvedBy?: boolean | ReorderRequest$resolvedByArgs<ExtArgs>
  }
  export type ReorderRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    requestedBy?: boolean | UserDefaultArgs<ExtArgs>
    resolvedBy?: boolean | ReorderRequest$resolvedByArgs<ExtArgs>
  }
  export type ReorderRequestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    requestedBy?: boolean | UserDefaultArgs<ExtArgs>
    resolvedBy?: boolean | ReorderRequest$resolvedByArgs<ExtArgs>
  }

  export type $ReorderRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReorderRequest"
    objects: {
      ticket: Prisma.$TicketPayload<ExtArgs>
      requestedBy: Prisma.$UserPayload<ExtArgs>
      resolvedBy: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ticketId: string
      requestedById: string
      requestedPosition: number
      reason: string | null
      status: $Enums.ReorderStatus
      resolvedById: string | null
      resolvedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["reorderRequest"]>
    composites: {}
  }

  type ReorderRequestGetPayload<S extends boolean | null | undefined | ReorderRequestDefaultArgs> = $Result.GetResult<Prisma.$ReorderRequestPayload, S>

  type ReorderRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReorderRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReorderRequestCountAggregateInputType | true
    }

  export interface ReorderRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReorderRequest'], meta: { name: 'ReorderRequest' } }
    /**
     * Find zero or one ReorderRequest that matches the filter.
     * @param {ReorderRequestFindUniqueArgs} args - Arguments to find a ReorderRequest
     * @example
     * // Get one ReorderRequest
     * const reorderRequest = await prisma.reorderRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReorderRequestFindUniqueArgs>(args: SelectSubset<T, ReorderRequestFindUniqueArgs<ExtArgs>>): Prisma__ReorderRequestClient<$Result.GetResult<Prisma.$ReorderRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ReorderRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReorderRequestFindUniqueOrThrowArgs} args - Arguments to find a ReorderRequest
     * @example
     * // Get one ReorderRequest
     * const reorderRequest = await prisma.reorderRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReorderRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, ReorderRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReorderRequestClient<$Result.GetResult<Prisma.$ReorderRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReorderRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReorderRequestFindFirstArgs} args - Arguments to find a ReorderRequest
     * @example
     * // Get one ReorderRequest
     * const reorderRequest = await prisma.reorderRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReorderRequestFindFirstArgs>(args?: SelectSubset<T, ReorderRequestFindFirstArgs<ExtArgs>>): Prisma__ReorderRequestClient<$Result.GetResult<Prisma.$ReorderRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReorderRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReorderRequestFindFirstOrThrowArgs} args - Arguments to find a ReorderRequest
     * @example
     * // Get one ReorderRequest
     * const reorderRequest = await prisma.reorderRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReorderRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, ReorderRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReorderRequestClient<$Result.GetResult<Prisma.$ReorderRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ReorderRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReorderRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReorderRequests
     * const reorderRequests = await prisma.reorderRequest.findMany()
     * 
     * // Get first 10 ReorderRequests
     * const reorderRequests = await prisma.reorderRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reorderRequestWithIdOnly = await prisma.reorderRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReorderRequestFindManyArgs>(args?: SelectSubset<T, ReorderRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReorderRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ReorderRequest.
     * @param {ReorderRequestCreateArgs} args - Arguments to create a ReorderRequest.
     * @example
     * // Create one ReorderRequest
     * const ReorderRequest = await prisma.reorderRequest.create({
     *   data: {
     *     // ... data to create a ReorderRequest
     *   }
     * })
     * 
     */
    create<T extends ReorderRequestCreateArgs>(args: SelectSubset<T, ReorderRequestCreateArgs<ExtArgs>>): Prisma__ReorderRequestClient<$Result.GetResult<Prisma.$ReorderRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ReorderRequests.
     * @param {ReorderRequestCreateManyArgs} args - Arguments to create many ReorderRequests.
     * @example
     * // Create many ReorderRequests
     * const reorderRequest = await prisma.reorderRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReorderRequestCreateManyArgs>(args?: SelectSubset<T, ReorderRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReorderRequests and returns the data saved in the database.
     * @param {ReorderRequestCreateManyAndReturnArgs} args - Arguments to create many ReorderRequests.
     * @example
     * // Create many ReorderRequests
     * const reorderRequest = await prisma.reorderRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReorderRequests and only return the `id`
     * const reorderRequestWithIdOnly = await prisma.reorderRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReorderRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, ReorderRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReorderRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ReorderRequest.
     * @param {ReorderRequestDeleteArgs} args - Arguments to delete one ReorderRequest.
     * @example
     * // Delete one ReorderRequest
     * const ReorderRequest = await prisma.reorderRequest.delete({
     *   where: {
     *     // ... filter to delete one ReorderRequest
     *   }
     * })
     * 
     */
    delete<T extends ReorderRequestDeleteArgs>(args: SelectSubset<T, ReorderRequestDeleteArgs<ExtArgs>>): Prisma__ReorderRequestClient<$Result.GetResult<Prisma.$ReorderRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ReorderRequest.
     * @param {ReorderRequestUpdateArgs} args - Arguments to update one ReorderRequest.
     * @example
     * // Update one ReorderRequest
     * const reorderRequest = await prisma.reorderRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReorderRequestUpdateArgs>(args: SelectSubset<T, ReorderRequestUpdateArgs<ExtArgs>>): Prisma__ReorderRequestClient<$Result.GetResult<Prisma.$ReorderRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ReorderRequests.
     * @param {ReorderRequestDeleteManyArgs} args - Arguments to filter ReorderRequests to delete.
     * @example
     * // Delete a few ReorderRequests
     * const { count } = await prisma.reorderRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReorderRequestDeleteManyArgs>(args?: SelectSubset<T, ReorderRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReorderRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReorderRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReorderRequests
     * const reorderRequest = await prisma.reorderRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReorderRequestUpdateManyArgs>(args: SelectSubset<T, ReorderRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReorderRequests and returns the data updated in the database.
     * @param {ReorderRequestUpdateManyAndReturnArgs} args - Arguments to update many ReorderRequests.
     * @example
     * // Update many ReorderRequests
     * const reorderRequest = await prisma.reorderRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ReorderRequests and only return the `id`
     * const reorderRequestWithIdOnly = await prisma.reorderRequest.updateManyAndReturn({
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
    updateManyAndReturn<T extends ReorderRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, ReorderRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReorderRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ReorderRequest.
     * @param {ReorderRequestUpsertArgs} args - Arguments to update or create a ReorderRequest.
     * @example
     * // Update or create a ReorderRequest
     * const reorderRequest = await prisma.reorderRequest.upsert({
     *   create: {
     *     // ... data to create a ReorderRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReorderRequest we want to update
     *   }
     * })
     */
    upsert<T extends ReorderRequestUpsertArgs>(args: SelectSubset<T, ReorderRequestUpsertArgs<ExtArgs>>): Prisma__ReorderRequestClient<$Result.GetResult<Prisma.$ReorderRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ReorderRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReorderRequestCountArgs} args - Arguments to filter ReorderRequests to count.
     * @example
     * // Count the number of ReorderRequests
     * const count = await prisma.reorderRequest.count({
     *   where: {
     *     // ... the filter for the ReorderRequests we want to count
     *   }
     * })
    **/
    count<T extends ReorderRequestCountArgs>(
      args?: Subset<T, ReorderRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReorderRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReorderRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReorderRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ReorderRequestAggregateArgs>(args: Subset<T, ReorderRequestAggregateArgs>): Prisma.PrismaPromise<GetReorderRequestAggregateType<T>>

    /**
     * Group by ReorderRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReorderRequestGroupByArgs} args - Group by arguments.
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
      T extends ReorderRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReorderRequestGroupByArgs['orderBy'] }
        : { orderBy?: ReorderRequestGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ReorderRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReorderRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReorderRequest model
   */
  readonly fields: ReorderRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReorderRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReorderRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ticket<T extends TicketDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TicketDefaultArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    requestedBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    resolvedBy<T extends ReorderRequest$resolvedByArgs<ExtArgs> = {}>(args?: Subset<T, ReorderRequest$resolvedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ReorderRequest model
   */
  interface ReorderRequestFieldRefs {
    readonly id: FieldRef<"ReorderRequest", 'String'>
    readonly ticketId: FieldRef<"ReorderRequest", 'String'>
    readonly requestedById: FieldRef<"ReorderRequest", 'String'>
    readonly requestedPosition: FieldRef<"ReorderRequest", 'Int'>
    readonly reason: FieldRef<"ReorderRequest", 'String'>
    readonly status: FieldRef<"ReorderRequest", 'ReorderStatus'>
    readonly resolvedById: FieldRef<"ReorderRequest", 'String'>
    readonly resolvedAt: FieldRef<"ReorderRequest", 'DateTime'>
    readonly createdAt: FieldRef<"ReorderRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReorderRequest findUnique
   */
  export type ReorderRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReorderRequest
     */
    select?: ReorderRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReorderRequest
     */
    omit?: ReorderRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReorderRequestInclude<ExtArgs> | null
    /**
     * Filter, which ReorderRequest to fetch.
     */
    where: ReorderRequestWhereUniqueInput
  }

  /**
   * ReorderRequest findUniqueOrThrow
   */
  export type ReorderRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReorderRequest
     */
    select?: ReorderRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReorderRequest
     */
    omit?: ReorderRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReorderRequestInclude<ExtArgs> | null
    /**
     * Filter, which ReorderRequest to fetch.
     */
    where: ReorderRequestWhereUniqueInput
  }

  /**
   * ReorderRequest findFirst
   */
  export type ReorderRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReorderRequest
     */
    select?: ReorderRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReorderRequest
     */
    omit?: ReorderRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReorderRequestInclude<ExtArgs> | null
    /**
     * Filter, which ReorderRequest to fetch.
     */
    where?: ReorderRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReorderRequests to fetch.
     */
    orderBy?: ReorderRequestOrderByWithRelationInput | ReorderRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReorderRequests.
     */
    cursor?: ReorderRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReorderRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReorderRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReorderRequests.
     */
    distinct?: ReorderRequestScalarFieldEnum | ReorderRequestScalarFieldEnum[]
  }

  /**
   * ReorderRequest findFirstOrThrow
   */
  export type ReorderRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReorderRequest
     */
    select?: ReorderRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReorderRequest
     */
    omit?: ReorderRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReorderRequestInclude<ExtArgs> | null
    /**
     * Filter, which ReorderRequest to fetch.
     */
    where?: ReorderRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReorderRequests to fetch.
     */
    orderBy?: ReorderRequestOrderByWithRelationInput | ReorderRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReorderRequests.
     */
    cursor?: ReorderRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReorderRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReorderRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReorderRequests.
     */
    distinct?: ReorderRequestScalarFieldEnum | ReorderRequestScalarFieldEnum[]
  }

  /**
   * ReorderRequest findMany
   */
  export type ReorderRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReorderRequest
     */
    select?: ReorderRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReorderRequest
     */
    omit?: ReorderRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReorderRequestInclude<ExtArgs> | null
    /**
     * Filter, which ReorderRequests to fetch.
     */
    where?: ReorderRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReorderRequests to fetch.
     */
    orderBy?: ReorderRequestOrderByWithRelationInput | ReorderRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReorderRequests.
     */
    cursor?: ReorderRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReorderRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReorderRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReorderRequests.
     */
    distinct?: ReorderRequestScalarFieldEnum | ReorderRequestScalarFieldEnum[]
  }

  /**
   * ReorderRequest create
   */
  export type ReorderRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReorderRequest
     */
    select?: ReorderRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReorderRequest
     */
    omit?: ReorderRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReorderRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a ReorderRequest.
     */
    data: XOR<ReorderRequestCreateInput, ReorderRequestUncheckedCreateInput>
  }

  /**
   * ReorderRequest createMany
   */
  export type ReorderRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReorderRequests.
     */
    data: ReorderRequestCreateManyInput | ReorderRequestCreateManyInput[]
  }

  /**
   * ReorderRequest createManyAndReturn
   */
  export type ReorderRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReorderRequest
     */
    select?: ReorderRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReorderRequest
     */
    omit?: ReorderRequestOmit<ExtArgs> | null
    /**
     * The data used to create many ReorderRequests.
     */
    data: ReorderRequestCreateManyInput | ReorderRequestCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReorderRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReorderRequest update
   */
  export type ReorderRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReorderRequest
     */
    select?: ReorderRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReorderRequest
     */
    omit?: ReorderRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReorderRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a ReorderRequest.
     */
    data: XOR<ReorderRequestUpdateInput, ReorderRequestUncheckedUpdateInput>
    /**
     * Choose, which ReorderRequest to update.
     */
    where: ReorderRequestWhereUniqueInput
  }

  /**
   * ReorderRequest updateMany
   */
  export type ReorderRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReorderRequests.
     */
    data: XOR<ReorderRequestUpdateManyMutationInput, ReorderRequestUncheckedUpdateManyInput>
    /**
     * Filter which ReorderRequests to update
     */
    where?: ReorderRequestWhereInput
    /**
     * Limit how many ReorderRequests to update.
     */
    limit?: number
  }

  /**
   * ReorderRequest updateManyAndReturn
   */
  export type ReorderRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReorderRequest
     */
    select?: ReorderRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReorderRequest
     */
    omit?: ReorderRequestOmit<ExtArgs> | null
    /**
     * The data used to update ReorderRequests.
     */
    data: XOR<ReorderRequestUpdateManyMutationInput, ReorderRequestUncheckedUpdateManyInput>
    /**
     * Filter which ReorderRequests to update
     */
    where?: ReorderRequestWhereInput
    /**
     * Limit how many ReorderRequests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReorderRequestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReorderRequest upsert
   */
  export type ReorderRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReorderRequest
     */
    select?: ReorderRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReorderRequest
     */
    omit?: ReorderRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReorderRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the ReorderRequest to update in case it exists.
     */
    where: ReorderRequestWhereUniqueInput
    /**
     * In case the ReorderRequest found by the `where` argument doesn't exist, create a new ReorderRequest with this data.
     */
    create: XOR<ReorderRequestCreateInput, ReorderRequestUncheckedCreateInput>
    /**
     * In case the ReorderRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReorderRequestUpdateInput, ReorderRequestUncheckedUpdateInput>
  }

  /**
   * ReorderRequest delete
   */
  export type ReorderRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReorderRequest
     */
    select?: ReorderRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReorderRequest
     */
    omit?: ReorderRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReorderRequestInclude<ExtArgs> | null
    /**
     * Filter which ReorderRequest to delete.
     */
    where: ReorderRequestWhereUniqueInput
  }

  /**
   * ReorderRequest deleteMany
   */
  export type ReorderRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReorderRequests to delete
     */
    where?: ReorderRequestWhereInput
    /**
     * Limit how many ReorderRequests to delete.
     */
    limit?: number
  }

  /**
   * ReorderRequest.resolvedBy
   */
  export type ReorderRequest$resolvedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * ReorderRequest without action
   */
  export type ReorderRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReorderRequest
     */
    select?: ReorderRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReorderRequest
     */
    omit?: ReorderRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReorderRequestInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: $Enums.NotificationType | null
    title: string | null
    body: string | null
    ticketId: string | null
    isRead: boolean | null
    requiresAck: boolean | null
    acknowledgedAt: Date | null
    createdAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: $Enums.NotificationType | null
    title: string | null
    body: string | null
    ticketId: string | null
    isRead: boolean | null
    requiresAck: boolean | null
    acknowledgedAt: Date | null
    createdAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    title: number
    body: number
    ticketId: number
    isRead: number
    requiresAck: number
    acknowledgedAt: number
    createdAt: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    title?: true
    body?: true
    ticketId?: true
    isRead?: true
    requiresAck?: true
    acknowledgedAt?: true
    createdAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    title?: true
    body?: true
    ticketId?: true
    isRead?: true
    requiresAck?: true
    acknowledgedAt?: true
    createdAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    title?: true
    body?: true
    ticketId?: true
    isRead?: true
    requiresAck?: true
    acknowledgedAt?: true
    createdAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    userId: string
    type: $Enums.NotificationType
    title: string
    body: string
    ticketId: string | null
    isRead: boolean
    requiresAck: boolean
    acknowledgedAt: Date | null
    createdAt: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    title?: boolean
    body?: boolean
    ticketId?: boolean
    isRead?: boolean
    requiresAck?: boolean
    acknowledgedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    ticket?: boolean | Notification$ticketArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    title?: boolean
    body?: boolean
    ticketId?: boolean
    isRead?: boolean
    requiresAck?: boolean
    acknowledgedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    ticket?: boolean | Notification$ticketArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    title?: boolean
    body?: boolean
    ticketId?: boolean
    isRead?: boolean
    requiresAck?: boolean
    acknowledgedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    ticket?: boolean | Notification$ticketArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    title?: boolean
    body?: boolean
    ticketId?: boolean
    isRead?: boolean
    requiresAck?: boolean
    acknowledgedAt?: boolean
    createdAt?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "title" | "body" | "ticketId" | "isRead" | "requiresAck" | "acknowledgedAt" | "createdAt", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    ticket?: boolean | Notification$ticketArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    ticket?: boolean | Notification$ticketArgs<ExtArgs>
  }
  export type NotificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    ticket?: boolean | Notification$ticketArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      ticket: Prisma.$TicketPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: $Enums.NotificationType
      title: string
      body: string
      ticketId: string | null
      isRead: boolean
      requiresAck: boolean
      acknowledgedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.updateManyAndReturn({
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
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
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
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    ticket<T extends Notification$ticketArgs<ExtArgs> = {}>(args?: Subset<T, Notification$ticketArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly userId: FieldRef<"Notification", 'String'>
    readonly type: FieldRef<"Notification", 'NotificationType'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly body: FieldRef<"Notification", 'String'>
    readonly ticketId: FieldRef<"Notification", 'String'>
    readonly isRead: FieldRef<"Notification", 'Boolean'>
    readonly requiresAck: FieldRef<"Notification", 'Boolean'>
    readonly acknowledgedAt: FieldRef<"Notification", 'DateTime'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification.ticket
   */
  export type Notification$ticketArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    where?: TicketWhereInput
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Model HelpRequest
   */

  export type AggregateHelpRequest = {
    _count: HelpRequestCountAggregateOutputType | null
    _min: HelpRequestMinAggregateOutputType | null
    _max: HelpRequestMaxAggregateOutputType | null
  }

  export type HelpRequestMinAggregateOutputType = {
    id: string | null
    requestedById: string | null
    contextMessage: string | null
    createdAt: Date | null
  }

  export type HelpRequestMaxAggregateOutputType = {
    id: string | null
    requestedById: string | null
    contextMessage: string | null
    createdAt: Date | null
  }

  export type HelpRequestCountAggregateOutputType = {
    id: number
    requestedById: number
    contextMessage: number
    createdAt: number
    _all: number
  }


  export type HelpRequestMinAggregateInputType = {
    id?: true
    requestedById?: true
    contextMessage?: true
    createdAt?: true
  }

  export type HelpRequestMaxAggregateInputType = {
    id?: true
    requestedById?: true
    contextMessage?: true
    createdAt?: true
  }

  export type HelpRequestCountAggregateInputType = {
    id?: true
    requestedById?: true
    contextMessage?: true
    createdAt?: true
    _all?: true
  }

  export type HelpRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HelpRequest to aggregate.
     */
    where?: HelpRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HelpRequests to fetch.
     */
    orderBy?: HelpRequestOrderByWithRelationInput | HelpRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HelpRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HelpRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HelpRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HelpRequests
    **/
    _count?: true | HelpRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HelpRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HelpRequestMaxAggregateInputType
  }

  export type GetHelpRequestAggregateType<T extends HelpRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateHelpRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHelpRequest[P]>
      : GetScalarType<T[P], AggregateHelpRequest[P]>
  }




  export type HelpRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HelpRequestWhereInput
    orderBy?: HelpRequestOrderByWithAggregationInput | HelpRequestOrderByWithAggregationInput[]
    by: HelpRequestScalarFieldEnum[] | HelpRequestScalarFieldEnum
    having?: HelpRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HelpRequestCountAggregateInputType | true
    _min?: HelpRequestMinAggregateInputType
    _max?: HelpRequestMaxAggregateInputType
  }

  export type HelpRequestGroupByOutputType = {
    id: string
    requestedById: string
    contextMessage: string
    createdAt: Date
    _count: HelpRequestCountAggregateOutputType | null
    _min: HelpRequestMinAggregateOutputType | null
    _max: HelpRequestMaxAggregateOutputType | null
  }

  type GetHelpRequestGroupByPayload<T extends HelpRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HelpRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HelpRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HelpRequestGroupByOutputType[P]>
            : GetScalarType<T[P], HelpRequestGroupByOutputType[P]>
        }
      >
    >


  export type HelpRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestedById?: boolean
    contextMessage?: boolean
    createdAt?: boolean
    requestedBy?: boolean | UserDefaultArgs<ExtArgs>
    responses?: boolean | HelpRequest$responsesArgs<ExtArgs>
    _count?: boolean | HelpRequestCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["helpRequest"]>

  export type HelpRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestedById?: boolean
    contextMessage?: boolean
    createdAt?: boolean
    requestedBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["helpRequest"]>

  export type HelpRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestedById?: boolean
    contextMessage?: boolean
    createdAt?: boolean
    requestedBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["helpRequest"]>

  export type HelpRequestSelectScalar = {
    id?: boolean
    requestedById?: boolean
    contextMessage?: boolean
    createdAt?: boolean
  }

  export type HelpRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "requestedById" | "contextMessage" | "createdAt", ExtArgs["result"]["helpRequest"]>
  export type HelpRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requestedBy?: boolean | UserDefaultArgs<ExtArgs>
    responses?: boolean | HelpRequest$responsesArgs<ExtArgs>
    _count?: boolean | HelpRequestCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type HelpRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requestedBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type HelpRequestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requestedBy?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $HelpRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HelpRequest"
    objects: {
      requestedBy: Prisma.$UserPayload<ExtArgs>
      responses: Prisma.$HelpRequestResponsePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requestedById: string
      contextMessage: string
      createdAt: Date
    }, ExtArgs["result"]["helpRequest"]>
    composites: {}
  }

  type HelpRequestGetPayload<S extends boolean | null | undefined | HelpRequestDefaultArgs> = $Result.GetResult<Prisma.$HelpRequestPayload, S>

  type HelpRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HelpRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HelpRequestCountAggregateInputType | true
    }

  export interface HelpRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HelpRequest'], meta: { name: 'HelpRequest' } }
    /**
     * Find zero or one HelpRequest that matches the filter.
     * @param {HelpRequestFindUniqueArgs} args - Arguments to find a HelpRequest
     * @example
     * // Get one HelpRequest
     * const helpRequest = await prisma.helpRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HelpRequestFindUniqueArgs>(args: SelectSubset<T, HelpRequestFindUniqueArgs<ExtArgs>>): Prisma__HelpRequestClient<$Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one HelpRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HelpRequestFindUniqueOrThrowArgs} args - Arguments to find a HelpRequest
     * @example
     * // Get one HelpRequest
     * const helpRequest = await prisma.helpRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HelpRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, HelpRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HelpRequestClient<$Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HelpRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestFindFirstArgs} args - Arguments to find a HelpRequest
     * @example
     * // Get one HelpRequest
     * const helpRequest = await prisma.helpRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HelpRequestFindFirstArgs>(args?: SelectSubset<T, HelpRequestFindFirstArgs<ExtArgs>>): Prisma__HelpRequestClient<$Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HelpRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestFindFirstOrThrowArgs} args - Arguments to find a HelpRequest
     * @example
     * // Get one HelpRequest
     * const helpRequest = await prisma.helpRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HelpRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, HelpRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__HelpRequestClient<$Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more HelpRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HelpRequests
     * const helpRequests = await prisma.helpRequest.findMany()
     * 
     * // Get first 10 HelpRequests
     * const helpRequests = await prisma.helpRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const helpRequestWithIdOnly = await prisma.helpRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HelpRequestFindManyArgs>(args?: SelectSubset<T, HelpRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a HelpRequest.
     * @param {HelpRequestCreateArgs} args - Arguments to create a HelpRequest.
     * @example
     * // Create one HelpRequest
     * const HelpRequest = await prisma.helpRequest.create({
     *   data: {
     *     // ... data to create a HelpRequest
     *   }
     * })
     * 
     */
    create<T extends HelpRequestCreateArgs>(args: SelectSubset<T, HelpRequestCreateArgs<ExtArgs>>): Prisma__HelpRequestClient<$Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many HelpRequests.
     * @param {HelpRequestCreateManyArgs} args - Arguments to create many HelpRequests.
     * @example
     * // Create many HelpRequests
     * const helpRequest = await prisma.helpRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HelpRequestCreateManyArgs>(args?: SelectSubset<T, HelpRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HelpRequests and returns the data saved in the database.
     * @param {HelpRequestCreateManyAndReturnArgs} args - Arguments to create many HelpRequests.
     * @example
     * // Create many HelpRequests
     * const helpRequest = await prisma.helpRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HelpRequests and only return the `id`
     * const helpRequestWithIdOnly = await prisma.helpRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HelpRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, HelpRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a HelpRequest.
     * @param {HelpRequestDeleteArgs} args - Arguments to delete one HelpRequest.
     * @example
     * // Delete one HelpRequest
     * const HelpRequest = await prisma.helpRequest.delete({
     *   where: {
     *     // ... filter to delete one HelpRequest
     *   }
     * })
     * 
     */
    delete<T extends HelpRequestDeleteArgs>(args: SelectSubset<T, HelpRequestDeleteArgs<ExtArgs>>): Prisma__HelpRequestClient<$Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one HelpRequest.
     * @param {HelpRequestUpdateArgs} args - Arguments to update one HelpRequest.
     * @example
     * // Update one HelpRequest
     * const helpRequest = await prisma.helpRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HelpRequestUpdateArgs>(args: SelectSubset<T, HelpRequestUpdateArgs<ExtArgs>>): Prisma__HelpRequestClient<$Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more HelpRequests.
     * @param {HelpRequestDeleteManyArgs} args - Arguments to filter HelpRequests to delete.
     * @example
     * // Delete a few HelpRequests
     * const { count } = await prisma.helpRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HelpRequestDeleteManyArgs>(args?: SelectSubset<T, HelpRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HelpRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HelpRequests
     * const helpRequest = await prisma.helpRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HelpRequestUpdateManyArgs>(args: SelectSubset<T, HelpRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HelpRequests and returns the data updated in the database.
     * @param {HelpRequestUpdateManyAndReturnArgs} args - Arguments to update many HelpRequests.
     * @example
     * // Update many HelpRequests
     * const helpRequest = await prisma.helpRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more HelpRequests and only return the `id`
     * const helpRequestWithIdOnly = await prisma.helpRequest.updateManyAndReturn({
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
    updateManyAndReturn<T extends HelpRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, HelpRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one HelpRequest.
     * @param {HelpRequestUpsertArgs} args - Arguments to update or create a HelpRequest.
     * @example
     * // Update or create a HelpRequest
     * const helpRequest = await prisma.helpRequest.upsert({
     *   create: {
     *     // ... data to create a HelpRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HelpRequest we want to update
     *   }
     * })
     */
    upsert<T extends HelpRequestUpsertArgs>(args: SelectSubset<T, HelpRequestUpsertArgs<ExtArgs>>): Prisma__HelpRequestClient<$Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of HelpRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestCountArgs} args - Arguments to filter HelpRequests to count.
     * @example
     * // Count the number of HelpRequests
     * const count = await prisma.helpRequest.count({
     *   where: {
     *     // ... the filter for the HelpRequests we want to count
     *   }
     * })
    **/
    count<T extends HelpRequestCountArgs>(
      args?: Subset<T, HelpRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HelpRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HelpRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends HelpRequestAggregateArgs>(args: Subset<T, HelpRequestAggregateArgs>): Prisma.PrismaPromise<GetHelpRequestAggregateType<T>>

    /**
     * Group by HelpRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestGroupByArgs} args - Group by arguments.
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
      T extends HelpRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HelpRequestGroupByArgs['orderBy'] }
        : { orderBy?: HelpRequestGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, HelpRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHelpRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HelpRequest model
   */
  readonly fields: HelpRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HelpRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HelpRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    requestedBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    responses<T extends HelpRequest$responsesArgs<ExtArgs> = {}>(args?: Subset<T, HelpRequest$responsesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HelpRequestResponsePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the HelpRequest model
   */
  interface HelpRequestFieldRefs {
    readonly id: FieldRef<"HelpRequest", 'String'>
    readonly requestedById: FieldRef<"HelpRequest", 'String'>
    readonly contextMessage: FieldRef<"HelpRequest", 'String'>
    readonly createdAt: FieldRef<"HelpRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * HelpRequest findUnique
   */
  export type HelpRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: HelpRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: HelpRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestInclude<ExtArgs> | null
    /**
     * Filter, which HelpRequest to fetch.
     */
    where: HelpRequestWhereUniqueInput
  }

  /**
   * HelpRequest findUniqueOrThrow
   */
  export type HelpRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: HelpRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: HelpRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestInclude<ExtArgs> | null
    /**
     * Filter, which HelpRequest to fetch.
     */
    where: HelpRequestWhereUniqueInput
  }

  /**
   * HelpRequest findFirst
   */
  export type HelpRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: HelpRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: HelpRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestInclude<ExtArgs> | null
    /**
     * Filter, which HelpRequest to fetch.
     */
    where?: HelpRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HelpRequests to fetch.
     */
    orderBy?: HelpRequestOrderByWithRelationInput | HelpRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HelpRequests.
     */
    cursor?: HelpRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HelpRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HelpRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HelpRequests.
     */
    distinct?: HelpRequestScalarFieldEnum | HelpRequestScalarFieldEnum[]
  }

  /**
   * HelpRequest findFirstOrThrow
   */
  export type HelpRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: HelpRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: HelpRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestInclude<ExtArgs> | null
    /**
     * Filter, which HelpRequest to fetch.
     */
    where?: HelpRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HelpRequests to fetch.
     */
    orderBy?: HelpRequestOrderByWithRelationInput | HelpRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HelpRequests.
     */
    cursor?: HelpRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HelpRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HelpRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HelpRequests.
     */
    distinct?: HelpRequestScalarFieldEnum | HelpRequestScalarFieldEnum[]
  }

  /**
   * HelpRequest findMany
   */
  export type HelpRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: HelpRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: HelpRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestInclude<ExtArgs> | null
    /**
     * Filter, which HelpRequests to fetch.
     */
    where?: HelpRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HelpRequests to fetch.
     */
    orderBy?: HelpRequestOrderByWithRelationInput | HelpRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HelpRequests.
     */
    cursor?: HelpRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HelpRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HelpRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HelpRequests.
     */
    distinct?: HelpRequestScalarFieldEnum | HelpRequestScalarFieldEnum[]
  }

  /**
   * HelpRequest create
   */
  export type HelpRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: HelpRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: HelpRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a HelpRequest.
     */
    data: XOR<HelpRequestCreateInput, HelpRequestUncheckedCreateInput>
  }

  /**
   * HelpRequest createMany
   */
  export type HelpRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HelpRequests.
     */
    data: HelpRequestCreateManyInput | HelpRequestCreateManyInput[]
  }

  /**
   * HelpRequest createManyAndReturn
   */
  export type HelpRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: HelpRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: HelpRequestOmit<ExtArgs> | null
    /**
     * The data used to create many HelpRequests.
     */
    data: HelpRequestCreateManyInput | HelpRequestCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * HelpRequest update
   */
  export type HelpRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: HelpRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: HelpRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a HelpRequest.
     */
    data: XOR<HelpRequestUpdateInput, HelpRequestUncheckedUpdateInput>
    /**
     * Choose, which HelpRequest to update.
     */
    where: HelpRequestWhereUniqueInput
  }

  /**
   * HelpRequest updateMany
   */
  export type HelpRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HelpRequests.
     */
    data: XOR<HelpRequestUpdateManyMutationInput, HelpRequestUncheckedUpdateManyInput>
    /**
     * Filter which HelpRequests to update
     */
    where?: HelpRequestWhereInput
    /**
     * Limit how many HelpRequests to update.
     */
    limit?: number
  }

  /**
   * HelpRequest updateManyAndReturn
   */
  export type HelpRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: HelpRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: HelpRequestOmit<ExtArgs> | null
    /**
     * The data used to update HelpRequests.
     */
    data: XOR<HelpRequestUpdateManyMutationInput, HelpRequestUncheckedUpdateManyInput>
    /**
     * Filter which HelpRequests to update
     */
    where?: HelpRequestWhereInput
    /**
     * Limit how many HelpRequests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * HelpRequest upsert
   */
  export type HelpRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: HelpRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: HelpRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the HelpRequest to update in case it exists.
     */
    where: HelpRequestWhereUniqueInput
    /**
     * In case the HelpRequest found by the `where` argument doesn't exist, create a new HelpRequest with this data.
     */
    create: XOR<HelpRequestCreateInput, HelpRequestUncheckedCreateInput>
    /**
     * In case the HelpRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HelpRequestUpdateInput, HelpRequestUncheckedUpdateInput>
  }

  /**
   * HelpRequest delete
   */
  export type HelpRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: HelpRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: HelpRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestInclude<ExtArgs> | null
    /**
     * Filter which HelpRequest to delete.
     */
    where: HelpRequestWhereUniqueInput
  }

  /**
   * HelpRequest deleteMany
   */
  export type HelpRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HelpRequests to delete
     */
    where?: HelpRequestWhereInput
    /**
     * Limit how many HelpRequests to delete.
     */
    limit?: number
  }

  /**
   * HelpRequest.responses
   */
  export type HelpRequest$responsesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequestResponse
     */
    select?: HelpRequestResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequestResponse
     */
    omit?: HelpRequestResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestResponseInclude<ExtArgs> | null
    where?: HelpRequestResponseWhereInput
    orderBy?: HelpRequestResponseOrderByWithRelationInput | HelpRequestResponseOrderByWithRelationInput[]
    cursor?: HelpRequestResponseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: HelpRequestResponseScalarFieldEnum | HelpRequestResponseScalarFieldEnum[]
  }

  /**
   * HelpRequest without action
   */
  export type HelpRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: HelpRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: HelpRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestInclude<ExtArgs> | null
  }


  /**
   * Model HelpRequestResponse
   */

  export type AggregateHelpRequestResponse = {
    _count: HelpRequestResponseCountAggregateOutputType | null
    _min: HelpRequestResponseMinAggregateOutputType | null
    _max: HelpRequestResponseMaxAggregateOutputType | null
  }

  export type HelpRequestResponseMinAggregateOutputType = {
    id: string | null
    helpRequestId: string | null
    responderId: string | null
    respondedAt: Date | null
  }

  export type HelpRequestResponseMaxAggregateOutputType = {
    id: string | null
    helpRequestId: string | null
    responderId: string | null
    respondedAt: Date | null
  }

  export type HelpRequestResponseCountAggregateOutputType = {
    id: number
    helpRequestId: number
    responderId: number
    respondedAt: number
    _all: number
  }


  export type HelpRequestResponseMinAggregateInputType = {
    id?: true
    helpRequestId?: true
    responderId?: true
    respondedAt?: true
  }

  export type HelpRequestResponseMaxAggregateInputType = {
    id?: true
    helpRequestId?: true
    responderId?: true
    respondedAt?: true
  }

  export type HelpRequestResponseCountAggregateInputType = {
    id?: true
    helpRequestId?: true
    responderId?: true
    respondedAt?: true
    _all?: true
  }

  export type HelpRequestResponseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HelpRequestResponse to aggregate.
     */
    where?: HelpRequestResponseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HelpRequestResponses to fetch.
     */
    orderBy?: HelpRequestResponseOrderByWithRelationInput | HelpRequestResponseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HelpRequestResponseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HelpRequestResponses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HelpRequestResponses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HelpRequestResponses
    **/
    _count?: true | HelpRequestResponseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HelpRequestResponseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HelpRequestResponseMaxAggregateInputType
  }

  export type GetHelpRequestResponseAggregateType<T extends HelpRequestResponseAggregateArgs> = {
        [P in keyof T & keyof AggregateHelpRequestResponse]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHelpRequestResponse[P]>
      : GetScalarType<T[P], AggregateHelpRequestResponse[P]>
  }




  export type HelpRequestResponseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HelpRequestResponseWhereInput
    orderBy?: HelpRequestResponseOrderByWithAggregationInput | HelpRequestResponseOrderByWithAggregationInput[]
    by: HelpRequestResponseScalarFieldEnum[] | HelpRequestResponseScalarFieldEnum
    having?: HelpRequestResponseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HelpRequestResponseCountAggregateInputType | true
    _min?: HelpRequestResponseMinAggregateInputType
    _max?: HelpRequestResponseMaxAggregateInputType
  }

  export type HelpRequestResponseGroupByOutputType = {
    id: string
    helpRequestId: string
    responderId: string
    respondedAt: Date
    _count: HelpRequestResponseCountAggregateOutputType | null
    _min: HelpRequestResponseMinAggregateOutputType | null
    _max: HelpRequestResponseMaxAggregateOutputType | null
  }

  type GetHelpRequestResponseGroupByPayload<T extends HelpRequestResponseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HelpRequestResponseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HelpRequestResponseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HelpRequestResponseGroupByOutputType[P]>
            : GetScalarType<T[P], HelpRequestResponseGroupByOutputType[P]>
        }
      >
    >


  export type HelpRequestResponseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    helpRequestId?: boolean
    responderId?: boolean
    respondedAt?: boolean
    helpRequest?: boolean | HelpRequestDefaultArgs<ExtArgs>
    responder?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["helpRequestResponse"]>

  export type HelpRequestResponseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    helpRequestId?: boolean
    responderId?: boolean
    respondedAt?: boolean
    helpRequest?: boolean | HelpRequestDefaultArgs<ExtArgs>
    responder?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["helpRequestResponse"]>

  export type HelpRequestResponseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    helpRequestId?: boolean
    responderId?: boolean
    respondedAt?: boolean
    helpRequest?: boolean | HelpRequestDefaultArgs<ExtArgs>
    responder?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["helpRequestResponse"]>

  export type HelpRequestResponseSelectScalar = {
    id?: boolean
    helpRequestId?: boolean
    responderId?: boolean
    respondedAt?: boolean
  }

  export type HelpRequestResponseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "helpRequestId" | "responderId" | "respondedAt", ExtArgs["result"]["helpRequestResponse"]>
  export type HelpRequestResponseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    helpRequest?: boolean | HelpRequestDefaultArgs<ExtArgs>
    responder?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type HelpRequestResponseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    helpRequest?: boolean | HelpRequestDefaultArgs<ExtArgs>
    responder?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type HelpRequestResponseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    helpRequest?: boolean | HelpRequestDefaultArgs<ExtArgs>
    responder?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $HelpRequestResponsePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HelpRequestResponse"
    objects: {
      helpRequest: Prisma.$HelpRequestPayload<ExtArgs>
      responder: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      helpRequestId: string
      responderId: string
      respondedAt: Date
    }, ExtArgs["result"]["helpRequestResponse"]>
    composites: {}
  }

  type HelpRequestResponseGetPayload<S extends boolean | null | undefined | HelpRequestResponseDefaultArgs> = $Result.GetResult<Prisma.$HelpRequestResponsePayload, S>

  type HelpRequestResponseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HelpRequestResponseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HelpRequestResponseCountAggregateInputType | true
    }

  export interface HelpRequestResponseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HelpRequestResponse'], meta: { name: 'HelpRequestResponse' } }
    /**
     * Find zero or one HelpRequestResponse that matches the filter.
     * @param {HelpRequestResponseFindUniqueArgs} args - Arguments to find a HelpRequestResponse
     * @example
     * // Get one HelpRequestResponse
     * const helpRequestResponse = await prisma.helpRequestResponse.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HelpRequestResponseFindUniqueArgs>(args: SelectSubset<T, HelpRequestResponseFindUniqueArgs<ExtArgs>>): Prisma__HelpRequestResponseClient<$Result.GetResult<Prisma.$HelpRequestResponsePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one HelpRequestResponse that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HelpRequestResponseFindUniqueOrThrowArgs} args - Arguments to find a HelpRequestResponse
     * @example
     * // Get one HelpRequestResponse
     * const helpRequestResponse = await prisma.helpRequestResponse.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HelpRequestResponseFindUniqueOrThrowArgs>(args: SelectSubset<T, HelpRequestResponseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HelpRequestResponseClient<$Result.GetResult<Prisma.$HelpRequestResponsePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HelpRequestResponse that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestResponseFindFirstArgs} args - Arguments to find a HelpRequestResponse
     * @example
     * // Get one HelpRequestResponse
     * const helpRequestResponse = await prisma.helpRequestResponse.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HelpRequestResponseFindFirstArgs>(args?: SelectSubset<T, HelpRequestResponseFindFirstArgs<ExtArgs>>): Prisma__HelpRequestResponseClient<$Result.GetResult<Prisma.$HelpRequestResponsePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HelpRequestResponse that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestResponseFindFirstOrThrowArgs} args - Arguments to find a HelpRequestResponse
     * @example
     * // Get one HelpRequestResponse
     * const helpRequestResponse = await prisma.helpRequestResponse.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HelpRequestResponseFindFirstOrThrowArgs>(args?: SelectSubset<T, HelpRequestResponseFindFirstOrThrowArgs<ExtArgs>>): Prisma__HelpRequestResponseClient<$Result.GetResult<Prisma.$HelpRequestResponsePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more HelpRequestResponses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestResponseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HelpRequestResponses
     * const helpRequestResponses = await prisma.helpRequestResponse.findMany()
     * 
     * // Get first 10 HelpRequestResponses
     * const helpRequestResponses = await prisma.helpRequestResponse.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const helpRequestResponseWithIdOnly = await prisma.helpRequestResponse.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HelpRequestResponseFindManyArgs>(args?: SelectSubset<T, HelpRequestResponseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HelpRequestResponsePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a HelpRequestResponse.
     * @param {HelpRequestResponseCreateArgs} args - Arguments to create a HelpRequestResponse.
     * @example
     * // Create one HelpRequestResponse
     * const HelpRequestResponse = await prisma.helpRequestResponse.create({
     *   data: {
     *     // ... data to create a HelpRequestResponse
     *   }
     * })
     * 
     */
    create<T extends HelpRequestResponseCreateArgs>(args: SelectSubset<T, HelpRequestResponseCreateArgs<ExtArgs>>): Prisma__HelpRequestResponseClient<$Result.GetResult<Prisma.$HelpRequestResponsePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many HelpRequestResponses.
     * @param {HelpRequestResponseCreateManyArgs} args - Arguments to create many HelpRequestResponses.
     * @example
     * // Create many HelpRequestResponses
     * const helpRequestResponse = await prisma.helpRequestResponse.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HelpRequestResponseCreateManyArgs>(args?: SelectSubset<T, HelpRequestResponseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HelpRequestResponses and returns the data saved in the database.
     * @param {HelpRequestResponseCreateManyAndReturnArgs} args - Arguments to create many HelpRequestResponses.
     * @example
     * // Create many HelpRequestResponses
     * const helpRequestResponse = await prisma.helpRequestResponse.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HelpRequestResponses and only return the `id`
     * const helpRequestResponseWithIdOnly = await prisma.helpRequestResponse.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HelpRequestResponseCreateManyAndReturnArgs>(args?: SelectSubset<T, HelpRequestResponseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HelpRequestResponsePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a HelpRequestResponse.
     * @param {HelpRequestResponseDeleteArgs} args - Arguments to delete one HelpRequestResponse.
     * @example
     * // Delete one HelpRequestResponse
     * const HelpRequestResponse = await prisma.helpRequestResponse.delete({
     *   where: {
     *     // ... filter to delete one HelpRequestResponse
     *   }
     * })
     * 
     */
    delete<T extends HelpRequestResponseDeleteArgs>(args: SelectSubset<T, HelpRequestResponseDeleteArgs<ExtArgs>>): Prisma__HelpRequestResponseClient<$Result.GetResult<Prisma.$HelpRequestResponsePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one HelpRequestResponse.
     * @param {HelpRequestResponseUpdateArgs} args - Arguments to update one HelpRequestResponse.
     * @example
     * // Update one HelpRequestResponse
     * const helpRequestResponse = await prisma.helpRequestResponse.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HelpRequestResponseUpdateArgs>(args: SelectSubset<T, HelpRequestResponseUpdateArgs<ExtArgs>>): Prisma__HelpRequestResponseClient<$Result.GetResult<Prisma.$HelpRequestResponsePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more HelpRequestResponses.
     * @param {HelpRequestResponseDeleteManyArgs} args - Arguments to filter HelpRequestResponses to delete.
     * @example
     * // Delete a few HelpRequestResponses
     * const { count } = await prisma.helpRequestResponse.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HelpRequestResponseDeleteManyArgs>(args?: SelectSubset<T, HelpRequestResponseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HelpRequestResponses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestResponseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HelpRequestResponses
     * const helpRequestResponse = await prisma.helpRequestResponse.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HelpRequestResponseUpdateManyArgs>(args: SelectSubset<T, HelpRequestResponseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HelpRequestResponses and returns the data updated in the database.
     * @param {HelpRequestResponseUpdateManyAndReturnArgs} args - Arguments to update many HelpRequestResponses.
     * @example
     * // Update many HelpRequestResponses
     * const helpRequestResponse = await prisma.helpRequestResponse.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more HelpRequestResponses and only return the `id`
     * const helpRequestResponseWithIdOnly = await prisma.helpRequestResponse.updateManyAndReturn({
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
    updateManyAndReturn<T extends HelpRequestResponseUpdateManyAndReturnArgs>(args: SelectSubset<T, HelpRequestResponseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HelpRequestResponsePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one HelpRequestResponse.
     * @param {HelpRequestResponseUpsertArgs} args - Arguments to update or create a HelpRequestResponse.
     * @example
     * // Update or create a HelpRequestResponse
     * const helpRequestResponse = await prisma.helpRequestResponse.upsert({
     *   create: {
     *     // ... data to create a HelpRequestResponse
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HelpRequestResponse we want to update
     *   }
     * })
     */
    upsert<T extends HelpRequestResponseUpsertArgs>(args: SelectSubset<T, HelpRequestResponseUpsertArgs<ExtArgs>>): Prisma__HelpRequestResponseClient<$Result.GetResult<Prisma.$HelpRequestResponsePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of HelpRequestResponses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestResponseCountArgs} args - Arguments to filter HelpRequestResponses to count.
     * @example
     * // Count the number of HelpRequestResponses
     * const count = await prisma.helpRequestResponse.count({
     *   where: {
     *     // ... the filter for the HelpRequestResponses we want to count
     *   }
     * })
    **/
    count<T extends HelpRequestResponseCountArgs>(
      args?: Subset<T, HelpRequestResponseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HelpRequestResponseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HelpRequestResponse.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestResponseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends HelpRequestResponseAggregateArgs>(args: Subset<T, HelpRequestResponseAggregateArgs>): Prisma.PrismaPromise<GetHelpRequestResponseAggregateType<T>>

    /**
     * Group by HelpRequestResponse.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestResponseGroupByArgs} args - Group by arguments.
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
      T extends HelpRequestResponseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HelpRequestResponseGroupByArgs['orderBy'] }
        : { orderBy?: HelpRequestResponseGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, HelpRequestResponseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHelpRequestResponseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HelpRequestResponse model
   */
  readonly fields: HelpRequestResponseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HelpRequestResponse.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HelpRequestResponseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    helpRequest<T extends HelpRequestDefaultArgs<ExtArgs> = {}>(args?: Subset<T, HelpRequestDefaultArgs<ExtArgs>>): Prisma__HelpRequestClient<$Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    responder<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the HelpRequestResponse model
   */
  interface HelpRequestResponseFieldRefs {
    readonly id: FieldRef<"HelpRequestResponse", 'String'>
    readonly helpRequestId: FieldRef<"HelpRequestResponse", 'String'>
    readonly responderId: FieldRef<"HelpRequestResponse", 'String'>
    readonly respondedAt: FieldRef<"HelpRequestResponse", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * HelpRequestResponse findUnique
   */
  export type HelpRequestResponseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequestResponse
     */
    select?: HelpRequestResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequestResponse
     */
    omit?: HelpRequestResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestResponseInclude<ExtArgs> | null
    /**
     * Filter, which HelpRequestResponse to fetch.
     */
    where: HelpRequestResponseWhereUniqueInput
  }

  /**
   * HelpRequestResponse findUniqueOrThrow
   */
  export type HelpRequestResponseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequestResponse
     */
    select?: HelpRequestResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequestResponse
     */
    omit?: HelpRequestResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestResponseInclude<ExtArgs> | null
    /**
     * Filter, which HelpRequestResponse to fetch.
     */
    where: HelpRequestResponseWhereUniqueInput
  }

  /**
   * HelpRequestResponse findFirst
   */
  export type HelpRequestResponseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequestResponse
     */
    select?: HelpRequestResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequestResponse
     */
    omit?: HelpRequestResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestResponseInclude<ExtArgs> | null
    /**
     * Filter, which HelpRequestResponse to fetch.
     */
    where?: HelpRequestResponseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HelpRequestResponses to fetch.
     */
    orderBy?: HelpRequestResponseOrderByWithRelationInput | HelpRequestResponseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HelpRequestResponses.
     */
    cursor?: HelpRequestResponseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HelpRequestResponses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HelpRequestResponses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HelpRequestResponses.
     */
    distinct?: HelpRequestResponseScalarFieldEnum | HelpRequestResponseScalarFieldEnum[]
  }

  /**
   * HelpRequestResponse findFirstOrThrow
   */
  export type HelpRequestResponseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequestResponse
     */
    select?: HelpRequestResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequestResponse
     */
    omit?: HelpRequestResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestResponseInclude<ExtArgs> | null
    /**
     * Filter, which HelpRequestResponse to fetch.
     */
    where?: HelpRequestResponseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HelpRequestResponses to fetch.
     */
    orderBy?: HelpRequestResponseOrderByWithRelationInput | HelpRequestResponseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HelpRequestResponses.
     */
    cursor?: HelpRequestResponseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HelpRequestResponses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HelpRequestResponses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HelpRequestResponses.
     */
    distinct?: HelpRequestResponseScalarFieldEnum | HelpRequestResponseScalarFieldEnum[]
  }

  /**
   * HelpRequestResponse findMany
   */
  export type HelpRequestResponseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequestResponse
     */
    select?: HelpRequestResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequestResponse
     */
    omit?: HelpRequestResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestResponseInclude<ExtArgs> | null
    /**
     * Filter, which HelpRequestResponses to fetch.
     */
    where?: HelpRequestResponseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HelpRequestResponses to fetch.
     */
    orderBy?: HelpRequestResponseOrderByWithRelationInput | HelpRequestResponseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HelpRequestResponses.
     */
    cursor?: HelpRequestResponseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HelpRequestResponses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HelpRequestResponses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HelpRequestResponses.
     */
    distinct?: HelpRequestResponseScalarFieldEnum | HelpRequestResponseScalarFieldEnum[]
  }

  /**
   * HelpRequestResponse create
   */
  export type HelpRequestResponseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequestResponse
     */
    select?: HelpRequestResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequestResponse
     */
    omit?: HelpRequestResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestResponseInclude<ExtArgs> | null
    /**
     * The data needed to create a HelpRequestResponse.
     */
    data: XOR<HelpRequestResponseCreateInput, HelpRequestResponseUncheckedCreateInput>
  }

  /**
   * HelpRequestResponse createMany
   */
  export type HelpRequestResponseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HelpRequestResponses.
     */
    data: HelpRequestResponseCreateManyInput | HelpRequestResponseCreateManyInput[]
  }

  /**
   * HelpRequestResponse createManyAndReturn
   */
  export type HelpRequestResponseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequestResponse
     */
    select?: HelpRequestResponseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequestResponse
     */
    omit?: HelpRequestResponseOmit<ExtArgs> | null
    /**
     * The data used to create many HelpRequestResponses.
     */
    data: HelpRequestResponseCreateManyInput | HelpRequestResponseCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestResponseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * HelpRequestResponse update
   */
  export type HelpRequestResponseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequestResponse
     */
    select?: HelpRequestResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequestResponse
     */
    omit?: HelpRequestResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestResponseInclude<ExtArgs> | null
    /**
     * The data needed to update a HelpRequestResponse.
     */
    data: XOR<HelpRequestResponseUpdateInput, HelpRequestResponseUncheckedUpdateInput>
    /**
     * Choose, which HelpRequestResponse to update.
     */
    where: HelpRequestResponseWhereUniqueInput
  }

  /**
   * HelpRequestResponse updateMany
   */
  export type HelpRequestResponseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HelpRequestResponses.
     */
    data: XOR<HelpRequestResponseUpdateManyMutationInput, HelpRequestResponseUncheckedUpdateManyInput>
    /**
     * Filter which HelpRequestResponses to update
     */
    where?: HelpRequestResponseWhereInput
    /**
     * Limit how many HelpRequestResponses to update.
     */
    limit?: number
  }

  /**
   * HelpRequestResponse updateManyAndReturn
   */
  export type HelpRequestResponseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequestResponse
     */
    select?: HelpRequestResponseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequestResponse
     */
    omit?: HelpRequestResponseOmit<ExtArgs> | null
    /**
     * The data used to update HelpRequestResponses.
     */
    data: XOR<HelpRequestResponseUpdateManyMutationInput, HelpRequestResponseUncheckedUpdateManyInput>
    /**
     * Filter which HelpRequestResponses to update
     */
    where?: HelpRequestResponseWhereInput
    /**
     * Limit how many HelpRequestResponses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestResponseIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * HelpRequestResponse upsert
   */
  export type HelpRequestResponseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequestResponse
     */
    select?: HelpRequestResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequestResponse
     */
    omit?: HelpRequestResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestResponseInclude<ExtArgs> | null
    /**
     * The filter to search for the HelpRequestResponse to update in case it exists.
     */
    where: HelpRequestResponseWhereUniqueInput
    /**
     * In case the HelpRequestResponse found by the `where` argument doesn't exist, create a new HelpRequestResponse with this data.
     */
    create: XOR<HelpRequestResponseCreateInput, HelpRequestResponseUncheckedCreateInput>
    /**
     * In case the HelpRequestResponse was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HelpRequestResponseUpdateInput, HelpRequestResponseUncheckedUpdateInput>
  }

  /**
   * HelpRequestResponse delete
   */
  export type HelpRequestResponseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequestResponse
     */
    select?: HelpRequestResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequestResponse
     */
    omit?: HelpRequestResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestResponseInclude<ExtArgs> | null
    /**
     * Filter which HelpRequestResponse to delete.
     */
    where: HelpRequestResponseWhereUniqueInput
  }

  /**
   * HelpRequestResponse deleteMany
   */
  export type HelpRequestResponseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HelpRequestResponses to delete
     */
    where?: HelpRequestResponseWhereInput
    /**
     * Limit how many HelpRequestResponses to delete.
     */
    limit?: number
  }

  /**
   * HelpRequestResponse without action
   */
  export type HelpRequestResponseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequestResponse
     */
    select?: HelpRequestResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HelpRequestResponse
     */
    omit?: HelpRequestResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HelpRequestResponseInclude<ExtArgs> | null
  }


  /**
   * Model Checkpoint
   */

  export type AggregateCheckpoint = {
    _count: CheckpointCountAggregateOutputType | null
    _min: CheckpointMinAggregateOutputType | null
    _max: CheckpointMaxAggregateOutputType | null
  }

  export type CheckpointMinAggregateOutputType = {
    id: string | null
    userId: string | null
    currentTask: string | null
    isBlocked: boolean | null
    notes: string | null
    createdAt: Date | null
  }

  export type CheckpointMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    currentTask: string | null
    isBlocked: boolean | null
    notes: string | null
    createdAt: Date | null
  }

  export type CheckpointCountAggregateOutputType = {
    id: number
    userId: number
    currentTask: number
    isBlocked: number
    notes: number
    createdAt: number
    _all: number
  }


  export type CheckpointMinAggregateInputType = {
    id?: true
    userId?: true
    currentTask?: true
    isBlocked?: true
    notes?: true
    createdAt?: true
  }

  export type CheckpointMaxAggregateInputType = {
    id?: true
    userId?: true
    currentTask?: true
    isBlocked?: true
    notes?: true
    createdAt?: true
  }

  export type CheckpointCountAggregateInputType = {
    id?: true
    userId?: true
    currentTask?: true
    isBlocked?: true
    notes?: true
    createdAt?: true
    _all?: true
  }

  export type CheckpointAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Checkpoint to aggregate.
     */
    where?: CheckpointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Checkpoints to fetch.
     */
    orderBy?: CheckpointOrderByWithRelationInput | CheckpointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CheckpointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Checkpoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Checkpoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Checkpoints
    **/
    _count?: true | CheckpointCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CheckpointMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CheckpointMaxAggregateInputType
  }

  export type GetCheckpointAggregateType<T extends CheckpointAggregateArgs> = {
        [P in keyof T & keyof AggregateCheckpoint]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCheckpoint[P]>
      : GetScalarType<T[P], AggregateCheckpoint[P]>
  }




  export type CheckpointGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CheckpointWhereInput
    orderBy?: CheckpointOrderByWithAggregationInput | CheckpointOrderByWithAggregationInput[]
    by: CheckpointScalarFieldEnum[] | CheckpointScalarFieldEnum
    having?: CheckpointScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CheckpointCountAggregateInputType | true
    _min?: CheckpointMinAggregateInputType
    _max?: CheckpointMaxAggregateInputType
  }

  export type CheckpointGroupByOutputType = {
    id: string
    userId: string
    currentTask: string
    isBlocked: boolean
    notes: string | null
    createdAt: Date
    _count: CheckpointCountAggregateOutputType | null
    _min: CheckpointMinAggregateOutputType | null
    _max: CheckpointMaxAggregateOutputType | null
  }

  type GetCheckpointGroupByPayload<T extends CheckpointGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CheckpointGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CheckpointGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CheckpointGroupByOutputType[P]>
            : GetScalarType<T[P], CheckpointGroupByOutputType[P]>
        }
      >
    >


  export type CheckpointSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    currentTask?: boolean
    isBlocked?: boolean
    notes?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["checkpoint"]>

  export type CheckpointSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    currentTask?: boolean
    isBlocked?: boolean
    notes?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["checkpoint"]>

  export type CheckpointSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    currentTask?: boolean
    isBlocked?: boolean
    notes?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["checkpoint"]>

  export type CheckpointSelectScalar = {
    id?: boolean
    userId?: boolean
    currentTask?: boolean
    isBlocked?: boolean
    notes?: boolean
    createdAt?: boolean
  }

  export type CheckpointOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "currentTask" | "isBlocked" | "notes" | "createdAt", ExtArgs["result"]["checkpoint"]>
  export type CheckpointInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CheckpointIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CheckpointIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CheckpointPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Checkpoint"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      currentTask: string
      isBlocked: boolean
      notes: string | null
      createdAt: Date
    }, ExtArgs["result"]["checkpoint"]>
    composites: {}
  }

  type CheckpointGetPayload<S extends boolean | null | undefined | CheckpointDefaultArgs> = $Result.GetResult<Prisma.$CheckpointPayload, S>

  type CheckpointCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CheckpointFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CheckpointCountAggregateInputType | true
    }

  export interface CheckpointDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Checkpoint'], meta: { name: 'Checkpoint' } }
    /**
     * Find zero or one Checkpoint that matches the filter.
     * @param {CheckpointFindUniqueArgs} args - Arguments to find a Checkpoint
     * @example
     * // Get one Checkpoint
     * const checkpoint = await prisma.checkpoint.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CheckpointFindUniqueArgs>(args: SelectSubset<T, CheckpointFindUniqueArgs<ExtArgs>>): Prisma__CheckpointClient<$Result.GetResult<Prisma.$CheckpointPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Checkpoint that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CheckpointFindUniqueOrThrowArgs} args - Arguments to find a Checkpoint
     * @example
     * // Get one Checkpoint
     * const checkpoint = await prisma.checkpoint.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CheckpointFindUniqueOrThrowArgs>(args: SelectSubset<T, CheckpointFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CheckpointClient<$Result.GetResult<Prisma.$CheckpointPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Checkpoint that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckpointFindFirstArgs} args - Arguments to find a Checkpoint
     * @example
     * // Get one Checkpoint
     * const checkpoint = await prisma.checkpoint.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CheckpointFindFirstArgs>(args?: SelectSubset<T, CheckpointFindFirstArgs<ExtArgs>>): Prisma__CheckpointClient<$Result.GetResult<Prisma.$CheckpointPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Checkpoint that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckpointFindFirstOrThrowArgs} args - Arguments to find a Checkpoint
     * @example
     * // Get one Checkpoint
     * const checkpoint = await prisma.checkpoint.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CheckpointFindFirstOrThrowArgs>(args?: SelectSubset<T, CheckpointFindFirstOrThrowArgs<ExtArgs>>): Prisma__CheckpointClient<$Result.GetResult<Prisma.$CheckpointPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Checkpoints that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckpointFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Checkpoints
     * const checkpoints = await prisma.checkpoint.findMany()
     * 
     * // Get first 10 Checkpoints
     * const checkpoints = await prisma.checkpoint.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const checkpointWithIdOnly = await prisma.checkpoint.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CheckpointFindManyArgs>(args?: SelectSubset<T, CheckpointFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CheckpointPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Checkpoint.
     * @param {CheckpointCreateArgs} args - Arguments to create a Checkpoint.
     * @example
     * // Create one Checkpoint
     * const Checkpoint = await prisma.checkpoint.create({
     *   data: {
     *     // ... data to create a Checkpoint
     *   }
     * })
     * 
     */
    create<T extends CheckpointCreateArgs>(args: SelectSubset<T, CheckpointCreateArgs<ExtArgs>>): Prisma__CheckpointClient<$Result.GetResult<Prisma.$CheckpointPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Checkpoints.
     * @param {CheckpointCreateManyArgs} args - Arguments to create many Checkpoints.
     * @example
     * // Create many Checkpoints
     * const checkpoint = await prisma.checkpoint.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CheckpointCreateManyArgs>(args?: SelectSubset<T, CheckpointCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Checkpoints and returns the data saved in the database.
     * @param {CheckpointCreateManyAndReturnArgs} args - Arguments to create many Checkpoints.
     * @example
     * // Create many Checkpoints
     * const checkpoint = await prisma.checkpoint.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Checkpoints and only return the `id`
     * const checkpointWithIdOnly = await prisma.checkpoint.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CheckpointCreateManyAndReturnArgs>(args?: SelectSubset<T, CheckpointCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CheckpointPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Checkpoint.
     * @param {CheckpointDeleteArgs} args - Arguments to delete one Checkpoint.
     * @example
     * // Delete one Checkpoint
     * const Checkpoint = await prisma.checkpoint.delete({
     *   where: {
     *     // ... filter to delete one Checkpoint
     *   }
     * })
     * 
     */
    delete<T extends CheckpointDeleteArgs>(args: SelectSubset<T, CheckpointDeleteArgs<ExtArgs>>): Prisma__CheckpointClient<$Result.GetResult<Prisma.$CheckpointPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Checkpoint.
     * @param {CheckpointUpdateArgs} args - Arguments to update one Checkpoint.
     * @example
     * // Update one Checkpoint
     * const checkpoint = await prisma.checkpoint.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CheckpointUpdateArgs>(args: SelectSubset<T, CheckpointUpdateArgs<ExtArgs>>): Prisma__CheckpointClient<$Result.GetResult<Prisma.$CheckpointPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Checkpoints.
     * @param {CheckpointDeleteManyArgs} args - Arguments to filter Checkpoints to delete.
     * @example
     * // Delete a few Checkpoints
     * const { count } = await prisma.checkpoint.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CheckpointDeleteManyArgs>(args?: SelectSubset<T, CheckpointDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Checkpoints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckpointUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Checkpoints
     * const checkpoint = await prisma.checkpoint.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CheckpointUpdateManyArgs>(args: SelectSubset<T, CheckpointUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Checkpoints and returns the data updated in the database.
     * @param {CheckpointUpdateManyAndReturnArgs} args - Arguments to update many Checkpoints.
     * @example
     * // Update many Checkpoints
     * const checkpoint = await prisma.checkpoint.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Checkpoints and only return the `id`
     * const checkpointWithIdOnly = await prisma.checkpoint.updateManyAndReturn({
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
    updateManyAndReturn<T extends CheckpointUpdateManyAndReturnArgs>(args: SelectSubset<T, CheckpointUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CheckpointPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Checkpoint.
     * @param {CheckpointUpsertArgs} args - Arguments to update or create a Checkpoint.
     * @example
     * // Update or create a Checkpoint
     * const checkpoint = await prisma.checkpoint.upsert({
     *   create: {
     *     // ... data to create a Checkpoint
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Checkpoint we want to update
     *   }
     * })
     */
    upsert<T extends CheckpointUpsertArgs>(args: SelectSubset<T, CheckpointUpsertArgs<ExtArgs>>): Prisma__CheckpointClient<$Result.GetResult<Prisma.$CheckpointPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Checkpoints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckpointCountArgs} args - Arguments to filter Checkpoints to count.
     * @example
     * // Count the number of Checkpoints
     * const count = await prisma.checkpoint.count({
     *   where: {
     *     // ... the filter for the Checkpoints we want to count
     *   }
     * })
    **/
    count<T extends CheckpointCountArgs>(
      args?: Subset<T, CheckpointCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CheckpointCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Checkpoint.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckpointAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CheckpointAggregateArgs>(args: Subset<T, CheckpointAggregateArgs>): Prisma.PrismaPromise<GetCheckpointAggregateType<T>>

    /**
     * Group by Checkpoint.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckpointGroupByArgs} args - Group by arguments.
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
      T extends CheckpointGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CheckpointGroupByArgs['orderBy'] }
        : { orderBy?: CheckpointGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CheckpointGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCheckpointGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Checkpoint model
   */
  readonly fields: CheckpointFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Checkpoint.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CheckpointClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Checkpoint model
   */
  interface CheckpointFieldRefs {
    readonly id: FieldRef<"Checkpoint", 'String'>
    readonly userId: FieldRef<"Checkpoint", 'String'>
    readonly currentTask: FieldRef<"Checkpoint", 'String'>
    readonly isBlocked: FieldRef<"Checkpoint", 'Boolean'>
    readonly notes: FieldRef<"Checkpoint", 'String'>
    readonly createdAt: FieldRef<"Checkpoint", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Checkpoint findUnique
   */
  export type CheckpointFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Checkpoint
     */
    select?: CheckpointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Checkpoint
     */
    omit?: CheckpointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CheckpointInclude<ExtArgs> | null
    /**
     * Filter, which Checkpoint to fetch.
     */
    where: CheckpointWhereUniqueInput
  }

  /**
   * Checkpoint findUniqueOrThrow
   */
  export type CheckpointFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Checkpoint
     */
    select?: CheckpointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Checkpoint
     */
    omit?: CheckpointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CheckpointInclude<ExtArgs> | null
    /**
     * Filter, which Checkpoint to fetch.
     */
    where: CheckpointWhereUniqueInput
  }

  /**
   * Checkpoint findFirst
   */
  export type CheckpointFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Checkpoint
     */
    select?: CheckpointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Checkpoint
     */
    omit?: CheckpointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CheckpointInclude<ExtArgs> | null
    /**
     * Filter, which Checkpoint to fetch.
     */
    where?: CheckpointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Checkpoints to fetch.
     */
    orderBy?: CheckpointOrderByWithRelationInput | CheckpointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Checkpoints.
     */
    cursor?: CheckpointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Checkpoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Checkpoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Checkpoints.
     */
    distinct?: CheckpointScalarFieldEnum | CheckpointScalarFieldEnum[]
  }

  /**
   * Checkpoint findFirstOrThrow
   */
  export type CheckpointFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Checkpoint
     */
    select?: CheckpointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Checkpoint
     */
    omit?: CheckpointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CheckpointInclude<ExtArgs> | null
    /**
     * Filter, which Checkpoint to fetch.
     */
    where?: CheckpointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Checkpoints to fetch.
     */
    orderBy?: CheckpointOrderByWithRelationInput | CheckpointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Checkpoints.
     */
    cursor?: CheckpointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Checkpoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Checkpoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Checkpoints.
     */
    distinct?: CheckpointScalarFieldEnum | CheckpointScalarFieldEnum[]
  }

  /**
   * Checkpoint findMany
   */
  export type CheckpointFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Checkpoint
     */
    select?: CheckpointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Checkpoint
     */
    omit?: CheckpointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CheckpointInclude<ExtArgs> | null
    /**
     * Filter, which Checkpoints to fetch.
     */
    where?: CheckpointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Checkpoints to fetch.
     */
    orderBy?: CheckpointOrderByWithRelationInput | CheckpointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Checkpoints.
     */
    cursor?: CheckpointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Checkpoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Checkpoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Checkpoints.
     */
    distinct?: CheckpointScalarFieldEnum | CheckpointScalarFieldEnum[]
  }

  /**
   * Checkpoint create
   */
  export type CheckpointCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Checkpoint
     */
    select?: CheckpointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Checkpoint
     */
    omit?: CheckpointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CheckpointInclude<ExtArgs> | null
    /**
     * The data needed to create a Checkpoint.
     */
    data: XOR<CheckpointCreateInput, CheckpointUncheckedCreateInput>
  }

  /**
   * Checkpoint createMany
   */
  export type CheckpointCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Checkpoints.
     */
    data: CheckpointCreateManyInput | CheckpointCreateManyInput[]
  }

  /**
   * Checkpoint createManyAndReturn
   */
  export type CheckpointCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Checkpoint
     */
    select?: CheckpointSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Checkpoint
     */
    omit?: CheckpointOmit<ExtArgs> | null
    /**
     * The data used to create many Checkpoints.
     */
    data: CheckpointCreateManyInput | CheckpointCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CheckpointIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Checkpoint update
   */
  export type CheckpointUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Checkpoint
     */
    select?: CheckpointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Checkpoint
     */
    omit?: CheckpointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CheckpointInclude<ExtArgs> | null
    /**
     * The data needed to update a Checkpoint.
     */
    data: XOR<CheckpointUpdateInput, CheckpointUncheckedUpdateInput>
    /**
     * Choose, which Checkpoint to update.
     */
    where: CheckpointWhereUniqueInput
  }

  /**
   * Checkpoint updateMany
   */
  export type CheckpointUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Checkpoints.
     */
    data: XOR<CheckpointUpdateManyMutationInput, CheckpointUncheckedUpdateManyInput>
    /**
     * Filter which Checkpoints to update
     */
    where?: CheckpointWhereInput
    /**
     * Limit how many Checkpoints to update.
     */
    limit?: number
  }

  /**
   * Checkpoint updateManyAndReturn
   */
  export type CheckpointUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Checkpoint
     */
    select?: CheckpointSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Checkpoint
     */
    omit?: CheckpointOmit<ExtArgs> | null
    /**
     * The data used to update Checkpoints.
     */
    data: XOR<CheckpointUpdateManyMutationInput, CheckpointUncheckedUpdateManyInput>
    /**
     * Filter which Checkpoints to update
     */
    where?: CheckpointWhereInput
    /**
     * Limit how many Checkpoints to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CheckpointIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Checkpoint upsert
   */
  export type CheckpointUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Checkpoint
     */
    select?: CheckpointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Checkpoint
     */
    omit?: CheckpointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CheckpointInclude<ExtArgs> | null
    /**
     * The filter to search for the Checkpoint to update in case it exists.
     */
    where: CheckpointWhereUniqueInput
    /**
     * In case the Checkpoint found by the `where` argument doesn't exist, create a new Checkpoint with this data.
     */
    create: XOR<CheckpointCreateInput, CheckpointUncheckedCreateInput>
    /**
     * In case the Checkpoint was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CheckpointUpdateInput, CheckpointUncheckedUpdateInput>
  }

  /**
   * Checkpoint delete
   */
  export type CheckpointDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Checkpoint
     */
    select?: CheckpointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Checkpoint
     */
    omit?: CheckpointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CheckpointInclude<ExtArgs> | null
    /**
     * Filter which Checkpoint to delete.
     */
    where: CheckpointWhereUniqueInput
  }

  /**
   * Checkpoint deleteMany
   */
  export type CheckpointDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Checkpoints to delete
     */
    where?: CheckpointWhereInput
    /**
     * Limit how many Checkpoints to delete.
     */
    limit?: number
  }

  /**
   * Checkpoint without action
   */
  export type CheckpointDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Checkpoint
     */
    select?: CheckpointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Checkpoint
     */
    omit?: CheckpointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CheckpointInclude<ExtArgs> | null
  }


  /**
   * Model CheckpointConfig
   */

  export type AggregateCheckpointConfig = {
    _count: CheckpointConfigCountAggregateOutputType | null
    _avg: CheckpointConfigAvgAggregateOutputType | null
    _sum: CheckpointConfigSumAggregateOutputType | null
    _min: CheckpointConfigMinAggregateOutputType | null
    _max: CheckpointConfigMaxAggregateOutputType | null
  }

  export type CheckpointConfigAvgAggregateOutputType = {
    intervalMinutes: number | null
  }

  export type CheckpointConfigSumAggregateOutputType = {
    intervalMinutes: number | null
  }

  export type CheckpointConfigMinAggregateOutputType = {
    id: string | null
    intervalMinutes: number | null
    activeHoursStart: string | null
    activeHoursEnd: string | null
    isEnabled: boolean | null
  }

  export type CheckpointConfigMaxAggregateOutputType = {
    id: string | null
    intervalMinutes: number | null
    activeHoursStart: string | null
    activeHoursEnd: string | null
    isEnabled: boolean | null
  }

  export type CheckpointConfigCountAggregateOutputType = {
    id: number
    intervalMinutes: number
    activeHoursStart: number
    activeHoursEnd: number
    isEnabled: number
    _all: number
  }


  export type CheckpointConfigAvgAggregateInputType = {
    intervalMinutes?: true
  }

  export type CheckpointConfigSumAggregateInputType = {
    intervalMinutes?: true
  }

  export type CheckpointConfigMinAggregateInputType = {
    id?: true
    intervalMinutes?: true
    activeHoursStart?: true
    activeHoursEnd?: true
    isEnabled?: true
  }

  export type CheckpointConfigMaxAggregateInputType = {
    id?: true
    intervalMinutes?: true
    activeHoursStart?: true
    activeHoursEnd?: true
    isEnabled?: true
  }

  export type CheckpointConfigCountAggregateInputType = {
    id?: true
    intervalMinutes?: true
    activeHoursStart?: true
    activeHoursEnd?: true
    isEnabled?: true
    _all?: true
  }

  export type CheckpointConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CheckpointConfig to aggregate.
     */
    where?: CheckpointConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CheckpointConfigs to fetch.
     */
    orderBy?: CheckpointConfigOrderByWithRelationInput | CheckpointConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CheckpointConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CheckpointConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CheckpointConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CheckpointConfigs
    **/
    _count?: true | CheckpointConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CheckpointConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CheckpointConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CheckpointConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CheckpointConfigMaxAggregateInputType
  }

  export type GetCheckpointConfigAggregateType<T extends CheckpointConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateCheckpointConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCheckpointConfig[P]>
      : GetScalarType<T[P], AggregateCheckpointConfig[P]>
  }




  export type CheckpointConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CheckpointConfigWhereInput
    orderBy?: CheckpointConfigOrderByWithAggregationInput | CheckpointConfigOrderByWithAggregationInput[]
    by: CheckpointConfigScalarFieldEnum[] | CheckpointConfigScalarFieldEnum
    having?: CheckpointConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CheckpointConfigCountAggregateInputType | true
    _avg?: CheckpointConfigAvgAggregateInputType
    _sum?: CheckpointConfigSumAggregateInputType
    _min?: CheckpointConfigMinAggregateInputType
    _max?: CheckpointConfigMaxAggregateInputType
  }

  export type CheckpointConfigGroupByOutputType = {
    id: string
    intervalMinutes: number
    activeHoursStart: string
    activeHoursEnd: string
    isEnabled: boolean
    _count: CheckpointConfigCountAggregateOutputType | null
    _avg: CheckpointConfigAvgAggregateOutputType | null
    _sum: CheckpointConfigSumAggregateOutputType | null
    _min: CheckpointConfigMinAggregateOutputType | null
    _max: CheckpointConfigMaxAggregateOutputType | null
  }

  type GetCheckpointConfigGroupByPayload<T extends CheckpointConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CheckpointConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CheckpointConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CheckpointConfigGroupByOutputType[P]>
            : GetScalarType<T[P], CheckpointConfigGroupByOutputType[P]>
        }
      >
    >


  export type CheckpointConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    intervalMinutes?: boolean
    activeHoursStart?: boolean
    activeHoursEnd?: boolean
    isEnabled?: boolean
  }, ExtArgs["result"]["checkpointConfig"]>

  export type CheckpointConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    intervalMinutes?: boolean
    activeHoursStart?: boolean
    activeHoursEnd?: boolean
    isEnabled?: boolean
  }, ExtArgs["result"]["checkpointConfig"]>

  export type CheckpointConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    intervalMinutes?: boolean
    activeHoursStart?: boolean
    activeHoursEnd?: boolean
    isEnabled?: boolean
  }, ExtArgs["result"]["checkpointConfig"]>

  export type CheckpointConfigSelectScalar = {
    id?: boolean
    intervalMinutes?: boolean
    activeHoursStart?: boolean
    activeHoursEnd?: boolean
    isEnabled?: boolean
  }

  export type CheckpointConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "intervalMinutes" | "activeHoursStart" | "activeHoursEnd" | "isEnabled", ExtArgs["result"]["checkpointConfig"]>

  export type $CheckpointConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CheckpointConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      intervalMinutes: number
      activeHoursStart: string
      activeHoursEnd: string
      isEnabled: boolean
    }, ExtArgs["result"]["checkpointConfig"]>
    composites: {}
  }

  type CheckpointConfigGetPayload<S extends boolean | null | undefined | CheckpointConfigDefaultArgs> = $Result.GetResult<Prisma.$CheckpointConfigPayload, S>

  type CheckpointConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CheckpointConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CheckpointConfigCountAggregateInputType | true
    }

  export interface CheckpointConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CheckpointConfig'], meta: { name: 'CheckpointConfig' } }
    /**
     * Find zero or one CheckpointConfig that matches the filter.
     * @param {CheckpointConfigFindUniqueArgs} args - Arguments to find a CheckpointConfig
     * @example
     * // Get one CheckpointConfig
     * const checkpointConfig = await prisma.checkpointConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CheckpointConfigFindUniqueArgs>(args: SelectSubset<T, CheckpointConfigFindUniqueArgs<ExtArgs>>): Prisma__CheckpointConfigClient<$Result.GetResult<Prisma.$CheckpointConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CheckpointConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CheckpointConfigFindUniqueOrThrowArgs} args - Arguments to find a CheckpointConfig
     * @example
     * // Get one CheckpointConfig
     * const checkpointConfig = await prisma.checkpointConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CheckpointConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, CheckpointConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CheckpointConfigClient<$Result.GetResult<Prisma.$CheckpointConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CheckpointConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckpointConfigFindFirstArgs} args - Arguments to find a CheckpointConfig
     * @example
     * // Get one CheckpointConfig
     * const checkpointConfig = await prisma.checkpointConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CheckpointConfigFindFirstArgs>(args?: SelectSubset<T, CheckpointConfigFindFirstArgs<ExtArgs>>): Prisma__CheckpointConfigClient<$Result.GetResult<Prisma.$CheckpointConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CheckpointConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckpointConfigFindFirstOrThrowArgs} args - Arguments to find a CheckpointConfig
     * @example
     * // Get one CheckpointConfig
     * const checkpointConfig = await prisma.checkpointConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CheckpointConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, CheckpointConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__CheckpointConfigClient<$Result.GetResult<Prisma.$CheckpointConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CheckpointConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckpointConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CheckpointConfigs
     * const checkpointConfigs = await prisma.checkpointConfig.findMany()
     * 
     * // Get first 10 CheckpointConfigs
     * const checkpointConfigs = await prisma.checkpointConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const checkpointConfigWithIdOnly = await prisma.checkpointConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CheckpointConfigFindManyArgs>(args?: SelectSubset<T, CheckpointConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CheckpointConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CheckpointConfig.
     * @param {CheckpointConfigCreateArgs} args - Arguments to create a CheckpointConfig.
     * @example
     * // Create one CheckpointConfig
     * const CheckpointConfig = await prisma.checkpointConfig.create({
     *   data: {
     *     // ... data to create a CheckpointConfig
     *   }
     * })
     * 
     */
    create<T extends CheckpointConfigCreateArgs>(args: SelectSubset<T, CheckpointConfigCreateArgs<ExtArgs>>): Prisma__CheckpointConfigClient<$Result.GetResult<Prisma.$CheckpointConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CheckpointConfigs.
     * @param {CheckpointConfigCreateManyArgs} args - Arguments to create many CheckpointConfigs.
     * @example
     * // Create many CheckpointConfigs
     * const checkpointConfig = await prisma.checkpointConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CheckpointConfigCreateManyArgs>(args?: SelectSubset<T, CheckpointConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CheckpointConfigs and returns the data saved in the database.
     * @param {CheckpointConfigCreateManyAndReturnArgs} args - Arguments to create many CheckpointConfigs.
     * @example
     * // Create many CheckpointConfigs
     * const checkpointConfig = await prisma.checkpointConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CheckpointConfigs and only return the `id`
     * const checkpointConfigWithIdOnly = await prisma.checkpointConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CheckpointConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, CheckpointConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CheckpointConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CheckpointConfig.
     * @param {CheckpointConfigDeleteArgs} args - Arguments to delete one CheckpointConfig.
     * @example
     * // Delete one CheckpointConfig
     * const CheckpointConfig = await prisma.checkpointConfig.delete({
     *   where: {
     *     // ... filter to delete one CheckpointConfig
     *   }
     * })
     * 
     */
    delete<T extends CheckpointConfigDeleteArgs>(args: SelectSubset<T, CheckpointConfigDeleteArgs<ExtArgs>>): Prisma__CheckpointConfigClient<$Result.GetResult<Prisma.$CheckpointConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CheckpointConfig.
     * @param {CheckpointConfigUpdateArgs} args - Arguments to update one CheckpointConfig.
     * @example
     * // Update one CheckpointConfig
     * const checkpointConfig = await prisma.checkpointConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CheckpointConfigUpdateArgs>(args: SelectSubset<T, CheckpointConfigUpdateArgs<ExtArgs>>): Prisma__CheckpointConfigClient<$Result.GetResult<Prisma.$CheckpointConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CheckpointConfigs.
     * @param {CheckpointConfigDeleteManyArgs} args - Arguments to filter CheckpointConfigs to delete.
     * @example
     * // Delete a few CheckpointConfigs
     * const { count } = await prisma.checkpointConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CheckpointConfigDeleteManyArgs>(args?: SelectSubset<T, CheckpointConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CheckpointConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckpointConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CheckpointConfigs
     * const checkpointConfig = await prisma.checkpointConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CheckpointConfigUpdateManyArgs>(args: SelectSubset<T, CheckpointConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CheckpointConfigs and returns the data updated in the database.
     * @param {CheckpointConfigUpdateManyAndReturnArgs} args - Arguments to update many CheckpointConfigs.
     * @example
     * // Update many CheckpointConfigs
     * const checkpointConfig = await prisma.checkpointConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CheckpointConfigs and only return the `id`
     * const checkpointConfigWithIdOnly = await prisma.checkpointConfig.updateManyAndReturn({
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
    updateManyAndReturn<T extends CheckpointConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, CheckpointConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CheckpointConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CheckpointConfig.
     * @param {CheckpointConfigUpsertArgs} args - Arguments to update or create a CheckpointConfig.
     * @example
     * // Update or create a CheckpointConfig
     * const checkpointConfig = await prisma.checkpointConfig.upsert({
     *   create: {
     *     // ... data to create a CheckpointConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CheckpointConfig we want to update
     *   }
     * })
     */
    upsert<T extends CheckpointConfigUpsertArgs>(args: SelectSubset<T, CheckpointConfigUpsertArgs<ExtArgs>>): Prisma__CheckpointConfigClient<$Result.GetResult<Prisma.$CheckpointConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CheckpointConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckpointConfigCountArgs} args - Arguments to filter CheckpointConfigs to count.
     * @example
     * // Count the number of CheckpointConfigs
     * const count = await prisma.checkpointConfig.count({
     *   where: {
     *     // ... the filter for the CheckpointConfigs we want to count
     *   }
     * })
    **/
    count<T extends CheckpointConfigCountArgs>(
      args?: Subset<T, CheckpointConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CheckpointConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CheckpointConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckpointConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CheckpointConfigAggregateArgs>(args: Subset<T, CheckpointConfigAggregateArgs>): Prisma.PrismaPromise<GetCheckpointConfigAggregateType<T>>

    /**
     * Group by CheckpointConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckpointConfigGroupByArgs} args - Group by arguments.
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
      T extends CheckpointConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CheckpointConfigGroupByArgs['orderBy'] }
        : { orderBy?: CheckpointConfigGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CheckpointConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCheckpointConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CheckpointConfig model
   */
  readonly fields: CheckpointConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CheckpointConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CheckpointConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the CheckpointConfig model
   */
  interface CheckpointConfigFieldRefs {
    readonly id: FieldRef<"CheckpointConfig", 'String'>
    readonly intervalMinutes: FieldRef<"CheckpointConfig", 'Int'>
    readonly activeHoursStart: FieldRef<"CheckpointConfig", 'String'>
    readonly activeHoursEnd: FieldRef<"CheckpointConfig", 'String'>
    readonly isEnabled: FieldRef<"CheckpointConfig", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * CheckpointConfig findUnique
   */
  export type CheckpointConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckpointConfig
     */
    select?: CheckpointConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CheckpointConfig
     */
    omit?: CheckpointConfigOmit<ExtArgs> | null
    /**
     * Filter, which CheckpointConfig to fetch.
     */
    where: CheckpointConfigWhereUniqueInput
  }

  /**
   * CheckpointConfig findUniqueOrThrow
   */
  export type CheckpointConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckpointConfig
     */
    select?: CheckpointConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CheckpointConfig
     */
    omit?: CheckpointConfigOmit<ExtArgs> | null
    /**
     * Filter, which CheckpointConfig to fetch.
     */
    where: CheckpointConfigWhereUniqueInput
  }

  /**
   * CheckpointConfig findFirst
   */
  export type CheckpointConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckpointConfig
     */
    select?: CheckpointConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CheckpointConfig
     */
    omit?: CheckpointConfigOmit<ExtArgs> | null
    /**
     * Filter, which CheckpointConfig to fetch.
     */
    where?: CheckpointConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CheckpointConfigs to fetch.
     */
    orderBy?: CheckpointConfigOrderByWithRelationInput | CheckpointConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CheckpointConfigs.
     */
    cursor?: CheckpointConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CheckpointConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CheckpointConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CheckpointConfigs.
     */
    distinct?: CheckpointConfigScalarFieldEnum | CheckpointConfigScalarFieldEnum[]
  }

  /**
   * CheckpointConfig findFirstOrThrow
   */
  export type CheckpointConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckpointConfig
     */
    select?: CheckpointConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CheckpointConfig
     */
    omit?: CheckpointConfigOmit<ExtArgs> | null
    /**
     * Filter, which CheckpointConfig to fetch.
     */
    where?: CheckpointConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CheckpointConfigs to fetch.
     */
    orderBy?: CheckpointConfigOrderByWithRelationInput | CheckpointConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CheckpointConfigs.
     */
    cursor?: CheckpointConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CheckpointConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CheckpointConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CheckpointConfigs.
     */
    distinct?: CheckpointConfigScalarFieldEnum | CheckpointConfigScalarFieldEnum[]
  }

  /**
   * CheckpointConfig findMany
   */
  export type CheckpointConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckpointConfig
     */
    select?: CheckpointConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CheckpointConfig
     */
    omit?: CheckpointConfigOmit<ExtArgs> | null
    /**
     * Filter, which CheckpointConfigs to fetch.
     */
    where?: CheckpointConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CheckpointConfigs to fetch.
     */
    orderBy?: CheckpointConfigOrderByWithRelationInput | CheckpointConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CheckpointConfigs.
     */
    cursor?: CheckpointConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CheckpointConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CheckpointConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CheckpointConfigs.
     */
    distinct?: CheckpointConfigScalarFieldEnum | CheckpointConfigScalarFieldEnum[]
  }

  /**
   * CheckpointConfig create
   */
  export type CheckpointConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckpointConfig
     */
    select?: CheckpointConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CheckpointConfig
     */
    omit?: CheckpointConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a CheckpointConfig.
     */
    data?: XOR<CheckpointConfigCreateInput, CheckpointConfigUncheckedCreateInput>
  }

  /**
   * CheckpointConfig createMany
   */
  export type CheckpointConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CheckpointConfigs.
     */
    data: CheckpointConfigCreateManyInput | CheckpointConfigCreateManyInput[]
  }

  /**
   * CheckpointConfig createManyAndReturn
   */
  export type CheckpointConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckpointConfig
     */
    select?: CheckpointConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CheckpointConfig
     */
    omit?: CheckpointConfigOmit<ExtArgs> | null
    /**
     * The data used to create many CheckpointConfigs.
     */
    data: CheckpointConfigCreateManyInput | CheckpointConfigCreateManyInput[]
  }

  /**
   * CheckpointConfig update
   */
  export type CheckpointConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckpointConfig
     */
    select?: CheckpointConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CheckpointConfig
     */
    omit?: CheckpointConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a CheckpointConfig.
     */
    data: XOR<CheckpointConfigUpdateInput, CheckpointConfigUncheckedUpdateInput>
    /**
     * Choose, which CheckpointConfig to update.
     */
    where: CheckpointConfigWhereUniqueInput
  }

  /**
   * CheckpointConfig updateMany
   */
  export type CheckpointConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CheckpointConfigs.
     */
    data: XOR<CheckpointConfigUpdateManyMutationInput, CheckpointConfigUncheckedUpdateManyInput>
    /**
     * Filter which CheckpointConfigs to update
     */
    where?: CheckpointConfigWhereInput
    /**
     * Limit how many CheckpointConfigs to update.
     */
    limit?: number
  }

  /**
   * CheckpointConfig updateManyAndReturn
   */
  export type CheckpointConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckpointConfig
     */
    select?: CheckpointConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CheckpointConfig
     */
    omit?: CheckpointConfigOmit<ExtArgs> | null
    /**
     * The data used to update CheckpointConfigs.
     */
    data: XOR<CheckpointConfigUpdateManyMutationInput, CheckpointConfigUncheckedUpdateManyInput>
    /**
     * Filter which CheckpointConfigs to update
     */
    where?: CheckpointConfigWhereInput
    /**
     * Limit how many CheckpointConfigs to update.
     */
    limit?: number
  }

  /**
   * CheckpointConfig upsert
   */
  export type CheckpointConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckpointConfig
     */
    select?: CheckpointConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CheckpointConfig
     */
    omit?: CheckpointConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the CheckpointConfig to update in case it exists.
     */
    where: CheckpointConfigWhereUniqueInput
    /**
     * In case the CheckpointConfig found by the `where` argument doesn't exist, create a new CheckpointConfig with this data.
     */
    create: XOR<CheckpointConfigCreateInput, CheckpointConfigUncheckedCreateInput>
    /**
     * In case the CheckpointConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CheckpointConfigUpdateInput, CheckpointConfigUncheckedUpdateInput>
  }

  /**
   * CheckpointConfig delete
   */
  export type CheckpointConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckpointConfig
     */
    select?: CheckpointConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CheckpointConfig
     */
    omit?: CheckpointConfigOmit<ExtArgs> | null
    /**
     * Filter which CheckpointConfig to delete.
     */
    where: CheckpointConfigWhereUniqueInput
  }

  /**
   * CheckpointConfig deleteMany
   */
  export type CheckpointConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CheckpointConfigs to delete
     */
    where?: CheckpointConfigWhereInput
    /**
     * Limit how many CheckpointConfigs to delete.
     */
    limit?: number
  }

  /**
   * CheckpointConfig without action
   */
  export type CheckpointConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckpointConfig
     */
    select?: CheckpointConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CheckpointConfig
     */
    omit?: CheckpointConfigOmit<ExtArgs> | null
  }


  /**
   * Model TvConfig
   */

  export type AggregateTvConfig = {
    _count: TvConfigCountAggregateOutputType | null
    _avg: TvConfigAvgAggregateOutputType | null
    _sum: TvConfigSumAggregateOutputType | null
    _min: TvConfigMinAggregateOutputType | null
    _max: TvConfigMaxAggregateOutputType | null
  }

  export type TvConfigAvgAggregateOutputType = {
    refreshInterval: number | null
  }

  export type TvConfigSumAggregateOutputType = {
    refreshInterval: number | null
  }

  export type TvConfigMinAggregateOutputType = {
    id: string | null
    isEnabled: boolean | null
    refreshInterval: number | null
  }

  export type TvConfigMaxAggregateOutputType = {
    id: string | null
    isEnabled: boolean | null
    refreshInterval: number | null
  }

  export type TvConfigCountAggregateOutputType = {
    id: number
    isEnabled: number
    refreshInterval: number
    _all: number
  }


  export type TvConfigAvgAggregateInputType = {
    refreshInterval?: true
  }

  export type TvConfigSumAggregateInputType = {
    refreshInterval?: true
  }

  export type TvConfigMinAggregateInputType = {
    id?: true
    isEnabled?: true
    refreshInterval?: true
  }

  export type TvConfigMaxAggregateInputType = {
    id?: true
    isEnabled?: true
    refreshInterval?: true
  }

  export type TvConfigCountAggregateInputType = {
    id?: true
    isEnabled?: true
    refreshInterval?: true
    _all?: true
  }

  export type TvConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TvConfig to aggregate.
     */
    where?: TvConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TvConfigs to fetch.
     */
    orderBy?: TvConfigOrderByWithRelationInput | TvConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TvConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TvConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TvConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TvConfigs
    **/
    _count?: true | TvConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TvConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TvConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TvConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TvConfigMaxAggregateInputType
  }

  export type GetTvConfigAggregateType<T extends TvConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateTvConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTvConfig[P]>
      : GetScalarType<T[P], AggregateTvConfig[P]>
  }




  export type TvConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TvConfigWhereInput
    orderBy?: TvConfigOrderByWithAggregationInput | TvConfigOrderByWithAggregationInput[]
    by: TvConfigScalarFieldEnum[] | TvConfigScalarFieldEnum
    having?: TvConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TvConfigCountAggregateInputType | true
    _avg?: TvConfigAvgAggregateInputType
    _sum?: TvConfigSumAggregateInputType
    _min?: TvConfigMinAggregateInputType
    _max?: TvConfigMaxAggregateInputType
  }

  export type TvConfigGroupByOutputType = {
    id: string
    isEnabled: boolean
    refreshInterval: number
    _count: TvConfigCountAggregateOutputType | null
    _avg: TvConfigAvgAggregateOutputType | null
    _sum: TvConfigSumAggregateOutputType | null
    _min: TvConfigMinAggregateOutputType | null
    _max: TvConfigMaxAggregateOutputType | null
  }

  type GetTvConfigGroupByPayload<T extends TvConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TvConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TvConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TvConfigGroupByOutputType[P]>
            : GetScalarType<T[P], TvConfigGroupByOutputType[P]>
        }
      >
    >


  export type TvConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    isEnabled?: boolean
    refreshInterval?: boolean
  }, ExtArgs["result"]["tvConfig"]>

  export type TvConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    isEnabled?: boolean
    refreshInterval?: boolean
  }, ExtArgs["result"]["tvConfig"]>

  export type TvConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    isEnabled?: boolean
    refreshInterval?: boolean
  }, ExtArgs["result"]["tvConfig"]>

  export type TvConfigSelectScalar = {
    id?: boolean
    isEnabled?: boolean
    refreshInterval?: boolean
  }

  export type TvConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "isEnabled" | "refreshInterval", ExtArgs["result"]["tvConfig"]>

  export type $TvConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TvConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      isEnabled: boolean
      refreshInterval: number
    }, ExtArgs["result"]["tvConfig"]>
    composites: {}
  }

  type TvConfigGetPayload<S extends boolean | null | undefined | TvConfigDefaultArgs> = $Result.GetResult<Prisma.$TvConfigPayload, S>

  type TvConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TvConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TvConfigCountAggregateInputType | true
    }

  export interface TvConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TvConfig'], meta: { name: 'TvConfig' } }
    /**
     * Find zero or one TvConfig that matches the filter.
     * @param {TvConfigFindUniqueArgs} args - Arguments to find a TvConfig
     * @example
     * // Get one TvConfig
     * const tvConfig = await prisma.tvConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TvConfigFindUniqueArgs>(args: SelectSubset<T, TvConfigFindUniqueArgs<ExtArgs>>): Prisma__TvConfigClient<$Result.GetResult<Prisma.$TvConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TvConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TvConfigFindUniqueOrThrowArgs} args - Arguments to find a TvConfig
     * @example
     * // Get one TvConfig
     * const tvConfig = await prisma.tvConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TvConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, TvConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TvConfigClient<$Result.GetResult<Prisma.$TvConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TvConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TvConfigFindFirstArgs} args - Arguments to find a TvConfig
     * @example
     * // Get one TvConfig
     * const tvConfig = await prisma.tvConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TvConfigFindFirstArgs>(args?: SelectSubset<T, TvConfigFindFirstArgs<ExtArgs>>): Prisma__TvConfigClient<$Result.GetResult<Prisma.$TvConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TvConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TvConfigFindFirstOrThrowArgs} args - Arguments to find a TvConfig
     * @example
     * // Get one TvConfig
     * const tvConfig = await prisma.tvConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TvConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, TvConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__TvConfigClient<$Result.GetResult<Prisma.$TvConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TvConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TvConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TvConfigs
     * const tvConfigs = await prisma.tvConfig.findMany()
     * 
     * // Get first 10 TvConfigs
     * const tvConfigs = await prisma.tvConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tvConfigWithIdOnly = await prisma.tvConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TvConfigFindManyArgs>(args?: SelectSubset<T, TvConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TvConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TvConfig.
     * @param {TvConfigCreateArgs} args - Arguments to create a TvConfig.
     * @example
     * // Create one TvConfig
     * const TvConfig = await prisma.tvConfig.create({
     *   data: {
     *     // ... data to create a TvConfig
     *   }
     * })
     * 
     */
    create<T extends TvConfigCreateArgs>(args: SelectSubset<T, TvConfigCreateArgs<ExtArgs>>): Prisma__TvConfigClient<$Result.GetResult<Prisma.$TvConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TvConfigs.
     * @param {TvConfigCreateManyArgs} args - Arguments to create many TvConfigs.
     * @example
     * // Create many TvConfigs
     * const tvConfig = await prisma.tvConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TvConfigCreateManyArgs>(args?: SelectSubset<T, TvConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TvConfigs and returns the data saved in the database.
     * @param {TvConfigCreateManyAndReturnArgs} args - Arguments to create many TvConfigs.
     * @example
     * // Create many TvConfigs
     * const tvConfig = await prisma.tvConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TvConfigs and only return the `id`
     * const tvConfigWithIdOnly = await prisma.tvConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TvConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, TvConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TvConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TvConfig.
     * @param {TvConfigDeleteArgs} args - Arguments to delete one TvConfig.
     * @example
     * // Delete one TvConfig
     * const TvConfig = await prisma.tvConfig.delete({
     *   where: {
     *     // ... filter to delete one TvConfig
     *   }
     * })
     * 
     */
    delete<T extends TvConfigDeleteArgs>(args: SelectSubset<T, TvConfigDeleteArgs<ExtArgs>>): Prisma__TvConfigClient<$Result.GetResult<Prisma.$TvConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TvConfig.
     * @param {TvConfigUpdateArgs} args - Arguments to update one TvConfig.
     * @example
     * // Update one TvConfig
     * const tvConfig = await prisma.tvConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TvConfigUpdateArgs>(args: SelectSubset<T, TvConfigUpdateArgs<ExtArgs>>): Prisma__TvConfigClient<$Result.GetResult<Prisma.$TvConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TvConfigs.
     * @param {TvConfigDeleteManyArgs} args - Arguments to filter TvConfigs to delete.
     * @example
     * // Delete a few TvConfigs
     * const { count } = await prisma.tvConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TvConfigDeleteManyArgs>(args?: SelectSubset<T, TvConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TvConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TvConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TvConfigs
     * const tvConfig = await prisma.tvConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TvConfigUpdateManyArgs>(args: SelectSubset<T, TvConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TvConfigs and returns the data updated in the database.
     * @param {TvConfigUpdateManyAndReturnArgs} args - Arguments to update many TvConfigs.
     * @example
     * // Update many TvConfigs
     * const tvConfig = await prisma.tvConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TvConfigs and only return the `id`
     * const tvConfigWithIdOnly = await prisma.tvConfig.updateManyAndReturn({
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
    updateManyAndReturn<T extends TvConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, TvConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TvConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TvConfig.
     * @param {TvConfigUpsertArgs} args - Arguments to update or create a TvConfig.
     * @example
     * // Update or create a TvConfig
     * const tvConfig = await prisma.tvConfig.upsert({
     *   create: {
     *     // ... data to create a TvConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TvConfig we want to update
     *   }
     * })
     */
    upsert<T extends TvConfigUpsertArgs>(args: SelectSubset<T, TvConfigUpsertArgs<ExtArgs>>): Prisma__TvConfigClient<$Result.GetResult<Prisma.$TvConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TvConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TvConfigCountArgs} args - Arguments to filter TvConfigs to count.
     * @example
     * // Count the number of TvConfigs
     * const count = await prisma.tvConfig.count({
     *   where: {
     *     // ... the filter for the TvConfigs we want to count
     *   }
     * })
    **/
    count<T extends TvConfigCountArgs>(
      args?: Subset<T, TvConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TvConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TvConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TvConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TvConfigAggregateArgs>(args: Subset<T, TvConfigAggregateArgs>): Prisma.PrismaPromise<GetTvConfigAggregateType<T>>

    /**
     * Group by TvConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TvConfigGroupByArgs} args - Group by arguments.
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
      T extends TvConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TvConfigGroupByArgs['orderBy'] }
        : { orderBy?: TvConfigGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TvConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTvConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TvConfig model
   */
  readonly fields: TvConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TvConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TvConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the TvConfig model
   */
  interface TvConfigFieldRefs {
    readonly id: FieldRef<"TvConfig", 'String'>
    readonly isEnabled: FieldRef<"TvConfig", 'Boolean'>
    readonly refreshInterval: FieldRef<"TvConfig", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * TvConfig findUnique
   */
  export type TvConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TvConfig
     */
    select?: TvConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TvConfig
     */
    omit?: TvConfigOmit<ExtArgs> | null
    /**
     * Filter, which TvConfig to fetch.
     */
    where: TvConfigWhereUniqueInput
  }

  /**
   * TvConfig findUniqueOrThrow
   */
  export type TvConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TvConfig
     */
    select?: TvConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TvConfig
     */
    omit?: TvConfigOmit<ExtArgs> | null
    /**
     * Filter, which TvConfig to fetch.
     */
    where: TvConfigWhereUniqueInput
  }

  /**
   * TvConfig findFirst
   */
  export type TvConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TvConfig
     */
    select?: TvConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TvConfig
     */
    omit?: TvConfigOmit<ExtArgs> | null
    /**
     * Filter, which TvConfig to fetch.
     */
    where?: TvConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TvConfigs to fetch.
     */
    orderBy?: TvConfigOrderByWithRelationInput | TvConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TvConfigs.
     */
    cursor?: TvConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TvConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TvConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TvConfigs.
     */
    distinct?: TvConfigScalarFieldEnum | TvConfigScalarFieldEnum[]
  }

  /**
   * TvConfig findFirstOrThrow
   */
  export type TvConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TvConfig
     */
    select?: TvConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TvConfig
     */
    omit?: TvConfigOmit<ExtArgs> | null
    /**
     * Filter, which TvConfig to fetch.
     */
    where?: TvConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TvConfigs to fetch.
     */
    orderBy?: TvConfigOrderByWithRelationInput | TvConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TvConfigs.
     */
    cursor?: TvConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TvConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TvConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TvConfigs.
     */
    distinct?: TvConfigScalarFieldEnum | TvConfigScalarFieldEnum[]
  }

  /**
   * TvConfig findMany
   */
  export type TvConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TvConfig
     */
    select?: TvConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TvConfig
     */
    omit?: TvConfigOmit<ExtArgs> | null
    /**
     * Filter, which TvConfigs to fetch.
     */
    where?: TvConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TvConfigs to fetch.
     */
    orderBy?: TvConfigOrderByWithRelationInput | TvConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TvConfigs.
     */
    cursor?: TvConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TvConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TvConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TvConfigs.
     */
    distinct?: TvConfigScalarFieldEnum | TvConfigScalarFieldEnum[]
  }

  /**
   * TvConfig create
   */
  export type TvConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TvConfig
     */
    select?: TvConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TvConfig
     */
    omit?: TvConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a TvConfig.
     */
    data?: XOR<TvConfigCreateInput, TvConfigUncheckedCreateInput>
  }

  /**
   * TvConfig createMany
   */
  export type TvConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TvConfigs.
     */
    data: TvConfigCreateManyInput | TvConfigCreateManyInput[]
  }

  /**
   * TvConfig createManyAndReturn
   */
  export type TvConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TvConfig
     */
    select?: TvConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TvConfig
     */
    omit?: TvConfigOmit<ExtArgs> | null
    /**
     * The data used to create many TvConfigs.
     */
    data: TvConfigCreateManyInput | TvConfigCreateManyInput[]
  }

  /**
   * TvConfig update
   */
  export type TvConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TvConfig
     */
    select?: TvConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TvConfig
     */
    omit?: TvConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a TvConfig.
     */
    data: XOR<TvConfigUpdateInput, TvConfigUncheckedUpdateInput>
    /**
     * Choose, which TvConfig to update.
     */
    where: TvConfigWhereUniqueInput
  }

  /**
   * TvConfig updateMany
   */
  export type TvConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TvConfigs.
     */
    data: XOR<TvConfigUpdateManyMutationInput, TvConfigUncheckedUpdateManyInput>
    /**
     * Filter which TvConfigs to update
     */
    where?: TvConfigWhereInput
    /**
     * Limit how many TvConfigs to update.
     */
    limit?: number
  }

  /**
   * TvConfig updateManyAndReturn
   */
  export type TvConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TvConfig
     */
    select?: TvConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TvConfig
     */
    omit?: TvConfigOmit<ExtArgs> | null
    /**
     * The data used to update TvConfigs.
     */
    data: XOR<TvConfigUpdateManyMutationInput, TvConfigUncheckedUpdateManyInput>
    /**
     * Filter which TvConfigs to update
     */
    where?: TvConfigWhereInput
    /**
     * Limit how many TvConfigs to update.
     */
    limit?: number
  }

  /**
   * TvConfig upsert
   */
  export type TvConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TvConfig
     */
    select?: TvConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TvConfig
     */
    omit?: TvConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the TvConfig to update in case it exists.
     */
    where: TvConfigWhereUniqueInput
    /**
     * In case the TvConfig found by the `where` argument doesn't exist, create a new TvConfig with this data.
     */
    create: XOR<TvConfigCreateInput, TvConfigUncheckedCreateInput>
    /**
     * In case the TvConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TvConfigUpdateInput, TvConfigUncheckedUpdateInput>
  }

  /**
   * TvConfig delete
   */
  export type TvConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TvConfig
     */
    select?: TvConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TvConfig
     */
    omit?: TvConfigOmit<ExtArgs> | null
    /**
     * Filter which TvConfig to delete.
     */
    where: TvConfigWhereUniqueInput
  }

  /**
   * TvConfig deleteMany
   */
  export type TvConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TvConfigs to delete
     */
    where?: TvConfigWhereInput
    /**
     * Limit how many TvConfigs to delete.
     */
    limit?: number
  }

  /**
   * TvConfig without action
   */
  export type TvConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TvConfig
     */
    select?: TvConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TvConfig
     */
    omit?: TvConfigOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    role: 'role',
    avatarUrl: 'avatarUrl',
    ninjaAlias: 'ninjaAlias',
    isActive: 'isActive',
    notifyTickets: 'notifyTickets',
    notifyBugs: 'notifyBugs',
    soundEnabled: 'soundEnabled',
    devStatus: 'devStatus',
    currentTask: 'currentTask',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const TicketScalarFieldEnum: {
    id: 'id',
    publicId: 'publicId',
    title: 'title',
    description: 'description',
    type: 'type',
    severity: 'severity',
    status: 'status',
    deadline: 'deadline',
    priorityOrder: 'priorityOrder',
    openedById: 'openedById',
    assignedToId: 'assignedToId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    resolvedAt: 'resolvedAt'
  };

  export type TicketScalarFieldEnum = (typeof TicketScalarFieldEnum)[keyof typeof TicketScalarFieldEnum]


  export const BugReportScalarFieldEnum: {
    id: 'id',
    ticketId: 'ticketId',
    affectedModule: 'affectedModule',
    stepsToReproduce: 'stepsToReproduce',
    expectedBehavior: 'expectedBehavior',
    actualBehavior: 'actualBehavior',
    environment: 'environment',
    customerId: 'customerId'
  };

  export type BugReportScalarFieldEnum = (typeof BugReportScalarFieldEnum)[keyof typeof BugReportScalarFieldEnum]


  export const TicketEventScalarFieldEnum: {
    id: 'id',
    ticketId: 'ticketId',
    eventType: 'eventType',
    actorId: 'actorId',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type TicketEventScalarFieldEnum = (typeof TicketEventScalarFieldEnum)[keyof typeof TicketEventScalarFieldEnum]


  export const ReorderRequestScalarFieldEnum: {
    id: 'id',
    ticketId: 'ticketId',
    requestedById: 'requestedById',
    requestedPosition: 'requestedPosition',
    reason: 'reason',
    status: 'status',
    resolvedById: 'resolvedById',
    resolvedAt: 'resolvedAt',
    createdAt: 'createdAt'
  };

  export type ReorderRequestScalarFieldEnum = (typeof ReorderRequestScalarFieldEnum)[keyof typeof ReorderRequestScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    title: 'title',
    body: 'body',
    ticketId: 'ticketId',
    isRead: 'isRead',
    requiresAck: 'requiresAck',
    acknowledgedAt: 'acknowledgedAt',
    createdAt: 'createdAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const HelpRequestScalarFieldEnum: {
    id: 'id',
    requestedById: 'requestedById',
    contextMessage: 'contextMessage',
    createdAt: 'createdAt'
  };

  export type HelpRequestScalarFieldEnum = (typeof HelpRequestScalarFieldEnum)[keyof typeof HelpRequestScalarFieldEnum]


  export const HelpRequestResponseScalarFieldEnum: {
    id: 'id',
    helpRequestId: 'helpRequestId',
    responderId: 'responderId',
    respondedAt: 'respondedAt'
  };

  export type HelpRequestResponseScalarFieldEnum = (typeof HelpRequestResponseScalarFieldEnum)[keyof typeof HelpRequestResponseScalarFieldEnum]


  export const CheckpointScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    currentTask: 'currentTask',
    isBlocked: 'isBlocked',
    notes: 'notes',
    createdAt: 'createdAt'
  };

  export type CheckpointScalarFieldEnum = (typeof CheckpointScalarFieldEnum)[keyof typeof CheckpointScalarFieldEnum]


  export const CheckpointConfigScalarFieldEnum: {
    id: 'id',
    intervalMinutes: 'intervalMinutes',
    activeHoursStart: 'activeHoursStart',
    activeHoursEnd: 'activeHoursEnd',
    isEnabled: 'isEnabled'
  };

  export type CheckpointConfigScalarFieldEnum = (typeof CheckpointConfigScalarFieldEnum)[keyof typeof CheckpointConfigScalarFieldEnum]


  export const TvConfigScalarFieldEnum: {
    id: 'id',
    isEnabled: 'isEnabled',
    refreshInterval: 'refreshInterval'
  };

  export type TvConfigScalarFieldEnum = (typeof TvConfigScalarFieldEnum)[keyof typeof TvConfigScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DevStatus'
   */
  export type EnumDevStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DevStatus'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'TicketType'
   */
  export type EnumTicketTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TicketType'>
    


  /**
   * Reference to a field of type 'Severity'
   */
  export type EnumSeverityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Severity'>
    


  /**
   * Reference to a field of type 'TicketStatus'
   */
  export type EnumTicketStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TicketStatus'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Environment'
   */
  export type EnumEnvironmentFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Environment'>
    


  /**
   * Reference to a field of type 'TicketEventType'
   */
  export type EnumTicketEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TicketEventType'>
    


  /**
   * Reference to a field of type 'ReorderStatus'
   */
  export type EnumReorderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReorderStatus'>
    


  /**
   * Reference to a field of type 'NotificationType'
   */
  export type EnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    avatarUrl?: StringNullableFilter<"User"> | string | null
    ninjaAlias?: StringFilter<"User"> | string
    isActive?: BoolFilter<"User"> | boolean
    notifyTickets?: BoolFilter<"User"> | boolean
    notifyBugs?: BoolFilter<"User"> | boolean
    soundEnabled?: BoolFilter<"User"> | boolean
    devStatus?: EnumDevStatusNullableFilter<"User"> | $Enums.DevStatus | null
    currentTask?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    openedTickets?: TicketListRelationFilter
    assignedTickets?: TicketListRelationFilter
    actorEvents?: TicketEventListRelationFilter
    requestedReorders?: ReorderRequestListRelationFilter
    resolvedReorders?: ReorderRequestListRelationFilter
    notifications?: NotificationListRelationFilter
    requestedHelp?: HelpRequestListRelationFilter
    helpResponses?: HelpRequestResponseListRelationFilter
    checkpoints?: CheckpointListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    ninjaAlias?: SortOrder
    isActive?: SortOrder
    notifyTickets?: SortOrder
    notifyBugs?: SortOrder
    soundEnabled?: SortOrder
    devStatus?: SortOrderInput | SortOrder
    currentTask?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    openedTickets?: TicketOrderByRelationAggregateInput
    assignedTickets?: TicketOrderByRelationAggregateInput
    actorEvents?: TicketEventOrderByRelationAggregateInput
    requestedReorders?: ReorderRequestOrderByRelationAggregateInput
    resolvedReorders?: ReorderRequestOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
    requestedHelp?: HelpRequestOrderByRelationAggregateInput
    helpResponses?: HelpRequestResponseOrderByRelationAggregateInput
    checkpoints?: CheckpointOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    avatarUrl?: StringNullableFilter<"User"> | string | null
    ninjaAlias?: StringFilter<"User"> | string
    isActive?: BoolFilter<"User"> | boolean
    notifyTickets?: BoolFilter<"User"> | boolean
    notifyBugs?: BoolFilter<"User"> | boolean
    soundEnabled?: BoolFilter<"User"> | boolean
    devStatus?: EnumDevStatusNullableFilter<"User"> | $Enums.DevStatus | null
    currentTask?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    openedTickets?: TicketListRelationFilter
    assignedTickets?: TicketListRelationFilter
    actorEvents?: TicketEventListRelationFilter
    requestedReorders?: ReorderRequestListRelationFilter
    resolvedReorders?: ReorderRequestListRelationFilter
    notifications?: NotificationListRelationFilter
    requestedHelp?: HelpRequestListRelationFilter
    helpResponses?: HelpRequestResponseListRelationFilter
    checkpoints?: CheckpointListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    ninjaAlias?: SortOrder
    isActive?: SortOrder
    notifyTickets?: SortOrder
    notifyBugs?: SortOrder
    soundEnabled?: SortOrder
    devStatus?: SortOrderInput | SortOrder
    currentTask?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    avatarUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    ninjaAlias?: StringWithAggregatesFilter<"User"> | string
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    notifyTickets?: BoolWithAggregatesFilter<"User"> | boolean
    notifyBugs?: BoolWithAggregatesFilter<"User"> | boolean
    soundEnabled?: BoolWithAggregatesFilter<"User"> | boolean
    devStatus?: EnumDevStatusNullableWithAggregatesFilter<"User"> | $Enums.DevStatus | null
    currentTask?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type TicketWhereInput = {
    AND?: TicketWhereInput | TicketWhereInput[]
    OR?: TicketWhereInput[]
    NOT?: TicketWhereInput | TicketWhereInput[]
    id?: StringFilter<"Ticket"> | string
    publicId?: StringFilter<"Ticket"> | string
    title?: StringFilter<"Ticket"> | string
    description?: StringFilter<"Ticket"> | string
    type?: EnumTicketTypeFilter<"Ticket"> | $Enums.TicketType
    severity?: EnumSeverityFilter<"Ticket"> | $Enums.Severity
    status?: EnumTicketStatusFilter<"Ticket"> | $Enums.TicketStatus
    deadline?: DateTimeFilter<"Ticket"> | Date | string
    priorityOrder?: IntFilter<"Ticket"> | number
    openedById?: StringFilter<"Ticket"> | string
    assignedToId?: StringNullableFilter<"Ticket"> | string | null
    createdAt?: DateTimeFilter<"Ticket"> | Date | string
    updatedAt?: DateTimeFilter<"Ticket"> | Date | string
    resolvedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    openedBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    assignedTo?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    bugReport?: XOR<BugReportNullableScalarRelationFilter, BugReportWhereInput> | null
    events?: TicketEventListRelationFilter
    reorderRequests?: ReorderRequestListRelationFilter
    notifications?: NotificationListRelationFilter
  }

  export type TicketOrderByWithRelationInput = {
    id?: SortOrder
    publicId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    deadline?: SortOrder
    priorityOrder?: SortOrder
    openedById?: SortOrder
    assignedToId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    openedBy?: UserOrderByWithRelationInput
    assignedTo?: UserOrderByWithRelationInput
    bugReport?: BugReportOrderByWithRelationInput
    events?: TicketEventOrderByRelationAggregateInput
    reorderRequests?: ReorderRequestOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
  }

  export type TicketWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    publicId?: string
    AND?: TicketWhereInput | TicketWhereInput[]
    OR?: TicketWhereInput[]
    NOT?: TicketWhereInput | TicketWhereInput[]
    title?: StringFilter<"Ticket"> | string
    description?: StringFilter<"Ticket"> | string
    type?: EnumTicketTypeFilter<"Ticket"> | $Enums.TicketType
    severity?: EnumSeverityFilter<"Ticket"> | $Enums.Severity
    status?: EnumTicketStatusFilter<"Ticket"> | $Enums.TicketStatus
    deadline?: DateTimeFilter<"Ticket"> | Date | string
    priorityOrder?: IntFilter<"Ticket"> | number
    openedById?: StringFilter<"Ticket"> | string
    assignedToId?: StringNullableFilter<"Ticket"> | string | null
    createdAt?: DateTimeFilter<"Ticket"> | Date | string
    updatedAt?: DateTimeFilter<"Ticket"> | Date | string
    resolvedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    openedBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    assignedTo?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    bugReport?: XOR<BugReportNullableScalarRelationFilter, BugReportWhereInput> | null
    events?: TicketEventListRelationFilter
    reorderRequests?: ReorderRequestListRelationFilter
    notifications?: NotificationListRelationFilter
  }, "id" | "publicId">

  export type TicketOrderByWithAggregationInput = {
    id?: SortOrder
    publicId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    deadline?: SortOrder
    priorityOrder?: SortOrder
    openedById?: SortOrder
    assignedToId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    _count?: TicketCountOrderByAggregateInput
    _avg?: TicketAvgOrderByAggregateInput
    _max?: TicketMaxOrderByAggregateInput
    _min?: TicketMinOrderByAggregateInput
    _sum?: TicketSumOrderByAggregateInput
  }

  export type TicketScalarWhereWithAggregatesInput = {
    AND?: TicketScalarWhereWithAggregatesInput | TicketScalarWhereWithAggregatesInput[]
    OR?: TicketScalarWhereWithAggregatesInput[]
    NOT?: TicketScalarWhereWithAggregatesInput | TicketScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Ticket"> | string
    publicId?: StringWithAggregatesFilter<"Ticket"> | string
    title?: StringWithAggregatesFilter<"Ticket"> | string
    description?: StringWithAggregatesFilter<"Ticket"> | string
    type?: EnumTicketTypeWithAggregatesFilter<"Ticket"> | $Enums.TicketType
    severity?: EnumSeverityWithAggregatesFilter<"Ticket"> | $Enums.Severity
    status?: EnumTicketStatusWithAggregatesFilter<"Ticket"> | $Enums.TicketStatus
    deadline?: DateTimeWithAggregatesFilter<"Ticket"> | Date | string
    priorityOrder?: IntWithAggregatesFilter<"Ticket"> | number
    openedById?: StringWithAggregatesFilter<"Ticket"> | string
    assignedToId?: StringNullableWithAggregatesFilter<"Ticket"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Ticket"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Ticket"> | Date | string
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"Ticket"> | Date | string | null
  }

  export type BugReportWhereInput = {
    AND?: BugReportWhereInput | BugReportWhereInput[]
    OR?: BugReportWhereInput[]
    NOT?: BugReportWhereInput | BugReportWhereInput[]
    id?: StringFilter<"BugReport"> | string
    ticketId?: StringFilter<"BugReport"> | string
    affectedModule?: StringFilter<"BugReport"> | string
    stepsToReproduce?: StringFilter<"BugReport"> | string
    expectedBehavior?: StringFilter<"BugReport"> | string
    actualBehavior?: StringFilter<"BugReport"> | string
    environment?: EnumEnvironmentFilter<"BugReport"> | $Enums.Environment
    customerId?: StringNullableFilter<"BugReport"> | string | null
    ticket?: XOR<TicketScalarRelationFilter, TicketWhereInput>
  }

  export type BugReportOrderByWithRelationInput = {
    id?: SortOrder
    ticketId?: SortOrder
    affectedModule?: SortOrder
    stepsToReproduce?: SortOrder
    expectedBehavior?: SortOrder
    actualBehavior?: SortOrder
    environment?: SortOrder
    customerId?: SortOrderInput | SortOrder
    ticket?: TicketOrderByWithRelationInput
  }

  export type BugReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    ticketId?: string
    AND?: BugReportWhereInput | BugReportWhereInput[]
    OR?: BugReportWhereInput[]
    NOT?: BugReportWhereInput | BugReportWhereInput[]
    affectedModule?: StringFilter<"BugReport"> | string
    stepsToReproduce?: StringFilter<"BugReport"> | string
    expectedBehavior?: StringFilter<"BugReport"> | string
    actualBehavior?: StringFilter<"BugReport"> | string
    environment?: EnumEnvironmentFilter<"BugReport"> | $Enums.Environment
    customerId?: StringNullableFilter<"BugReport"> | string | null
    ticket?: XOR<TicketScalarRelationFilter, TicketWhereInput>
  }, "id" | "ticketId">

  export type BugReportOrderByWithAggregationInput = {
    id?: SortOrder
    ticketId?: SortOrder
    affectedModule?: SortOrder
    stepsToReproduce?: SortOrder
    expectedBehavior?: SortOrder
    actualBehavior?: SortOrder
    environment?: SortOrder
    customerId?: SortOrderInput | SortOrder
    _count?: BugReportCountOrderByAggregateInput
    _max?: BugReportMaxOrderByAggregateInput
    _min?: BugReportMinOrderByAggregateInput
  }

  export type BugReportScalarWhereWithAggregatesInput = {
    AND?: BugReportScalarWhereWithAggregatesInput | BugReportScalarWhereWithAggregatesInput[]
    OR?: BugReportScalarWhereWithAggregatesInput[]
    NOT?: BugReportScalarWhereWithAggregatesInput | BugReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BugReport"> | string
    ticketId?: StringWithAggregatesFilter<"BugReport"> | string
    affectedModule?: StringWithAggregatesFilter<"BugReport"> | string
    stepsToReproduce?: StringWithAggregatesFilter<"BugReport"> | string
    expectedBehavior?: StringWithAggregatesFilter<"BugReport"> | string
    actualBehavior?: StringWithAggregatesFilter<"BugReport"> | string
    environment?: EnumEnvironmentWithAggregatesFilter<"BugReport"> | $Enums.Environment
    customerId?: StringNullableWithAggregatesFilter<"BugReport"> | string | null
  }

  export type TicketEventWhereInput = {
    AND?: TicketEventWhereInput | TicketEventWhereInput[]
    OR?: TicketEventWhereInput[]
    NOT?: TicketEventWhereInput | TicketEventWhereInput[]
    id?: StringFilter<"TicketEvent"> | string
    ticketId?: StringFilter<"TicketEvent"> | string
    eventType?: EnumTicketEventTypeFilter<"TicketEvent"> | $Enums.TicketEventType
    actorId?: StringFilter<"TicketEvent"> | string
    metadata?: StringFilter<"TicketEvent"> | string
    createdAt?: DateTimeFilter<"TicketEvent"> | Date | string
    ticket?: XOR<TicketScalarRelationFilter, TicketWhereInput>
    actor?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type TicketEventOrderByWithRelationInput = {
    id?: SortOrder
    ticketId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    ticket?: TicketOrderByWithRelationInput
    actor?: UserOrderByWithRelationInput
  }

  export type TicketEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TicketEventWhereInput | TicketEventWhereInput[]
    OR?: TicketEventWhereInput[]
    NOT?: TicketEventWhereInput | TicketEventWhereInput[]
    ticketId?: StringFilter<"TicketEvent"> | string
    eventType?: EnumTicketEventTypeFilter<"TicketEvent"> | $Enums.TicketEventType
    actorId?: StringFilter<"TicketEvent"> | string
    metadata?: StringFilter<"TicketEvent"> | string
    createdAt?: DateTimeFilter<"TicketEvent"> | Date | string
    ticket?: XOR<TicketScalarRelationFilter, TicketWhereInput>
    actor?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type TicketEventOrderByWithAggregationInput = {
    id?: SortOrder
    ticketId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    _count?: TicketEventCountOrderByAggregateInput
    _max?: TicketEventMaxOrderByAggregateInput
    _min?: TicketEventMinOrderByAggregateInput
  }

  export type TicketEventScalarWhereWithAggregatesInput = {
    AND?: TicketEventScalarWhereWithAggregatesInput | TicketEventScalarWhereWithAggregatesInput[]
    OR?: TicketEventScalarWhereWithAggregatesInput[]
    NOT?: TicketEventScalarWhereWithAggregatesInput | TicketEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TicketEvent"> | string
    ticketId?: StringWithAggregatesFilter<"TicketEvent"> | string
    eventType?: EnumTicketEventTypeWithAggregatesFilter<"TicketEvent"> | $Enums.TicketEventType
    actorId?: StringWithAggregatesFilter<"TicketEvent"> | string
    metadata?: StringWithAggregatesFilter<"TicketEvent"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TicketEvent"> | Date | string
  }

  export type ReorderRequestWhereInput = {
    AND?: ReorderRequestWhereInput | ReorderRequestWhereInput[]
    OR?: ReorderRequestWhereInput[]
    NOT?: ReorderRequestWhereInput | ReorderRequestWhereInput[]
    id?: StringFilter<"ReorderRequest"> | string
    ticketId?: StringFilter<"ReorderRequest"> | string
    requestedById?: StringFilter<"ReorderRequest"> | string
    requestedPosition?: IntFilter<"ReorderRequest"> | number
    reason?: StringNullableFilter<"ReorderRequest"> | string | null
    status?: EnumReorderStatusFilter<"ReorderRequest"> | $Enums.ReorderStatus
    resolvedById?: StringNullableFilter<"ReorderRequest"> | string | null
    resolvedAt?: DateTimeNullableFilter<"ReorderRequest"> | Date | string | null
    createdAt?: DateTimeFilter<"ReorderRequest"> | Date | string
    ticket?: XOR<TicketScalarRelationFilter, TicketWhereInput>
    requestedBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    resolvedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type ReorderRequestOrderByWithRelationInput = {
    id?: SortOrder
    ticketId?: SortOrder
    requestedById?: SortOrder
    requestedPosition?: SortOrder
    reason?: SortOrderInput | SortOrder
    status?: SortOrder
    resolvedById?: SortOrderInput | SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    ticket?: TicketOrderByWithRelationInput
    requestedBy?: UserOrderByWithRelationInput
    resolvedBy?: UserOrderByWithRelationInput
  }

  export type ReorderRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReorderRequestWhereInput | ReorderRequestWhereInput[]
    OR?: ReorderRequestWhereInput[]
    NOT?: ReorderRequestWhereInput | ReorderRequestWhereInput[]
    ticketId?: StringFilter<"ReorderRequest"> | string
    requestedById?: StringFilter<"ReorderRequest"> | string
    requestedPosition?: IntFilter<"ReorderRequest"> | number
    reason?: StringNullableFilter<"ReorderRequest"> | string | null
    status?: EnumReorderStatusFilter<"ReorderRequest"> | $Enums.ReorderStatus
    resolvedById?: StringNullableFilter<"ReorderRequest"> | string | null
    resolvedAt?: DateTimeNullableFilter<"ReorderRequest"> | Date | string | null
    createdAt?: DateTimeFilter<"ReorderRequest"> | Date | string
    ticket?: XOR<TicketScalarRelationFilter, TicketWhereInput>
    requestedBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    resolvedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type ReorderRequestOrderByWithAggregationInput = {
    id?: SortOrder
    ticketId?: SortOrder
    requestedById?: SortOrder
    requestedPosition?: SortOrder
    reason?: SortOrderInput | SortOrder
    status?: SortOrder
    resolvedById?: SortOrderInput | SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ReorderRequestCountOrderByAggregateInput
    _avg?: ReorderRequestAvgOrderByAggregateInput
    _max?: ReorderRequestMaxOrderByAggregateInput
    _min?: ReorderRequestMinOrderByAggregateInput
    _sum?: ReorderRequestSumOrderByAggregateInput
  }

  export type ReorderRequestScalarWhereWithAggregatesInput = {
    AND?: ReorderRequestScalarWhereWithAggregatesInput | ReorderRequestScalarWhereWithAggregatesInput[]
    OR?: ReorderRequestScalarWhereWithAggregatesInput[]
    NOT?: ReorderRequestScalarWhereWithAggregatesInput | ReorderRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ReorderRequest"> | string
    ticketId?: StringWithAggregatesFilter<"ReorderRequest"> | string
    requestedById?: StringWithAggregatesFilter<"ReorderRequest"> | string
    requestedPosition?: IntWithAggregatesFilter<"ReorderRequest"> | number
    reason?: StringNullableWithAggregatesFilter<"ReorderRequest"> | string | null
    status?: EnumReorderStatusWithAggregatesFilter<"ReorderRequest"> | $Enums.ReorderStatus
    resolvedById?: StringNullableWithAggregatesFilter<"ReorderRequest"> | string | null
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"ReorderRequest"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ReorderRequest"> | Date | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringFilter<"Notification"> | string
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    ticketId?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    requiresAck?: BoolFilter<"Notification"> | boolean
    acknowledgedAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    ticket?: XOR<TicketNullableScalarRelationFilter, TicketWhereInput> | null
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    ticketId?: SortOrderInput | SortOrder
    isRead?: SortOrder
    requiresAck?: SortOrder
    acknowledgedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    ticket?: TicketOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    userId?: StringFilter<"Notification"> | string
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    ticketId?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    requiresAck?: BoolFilter<"Notification"> | boolean
    acknowledgedAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    ticket?: XOR<TicketNullableScalarRelationFilter, TicketWhereInput> | null
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    ticketId?: SortOrderInput | SortOrder
    isRead?: SortOrder
    requiresAck?: SortOrder
    acknowledgedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    userId?: StringWithAggregatesFilter<"Notification"> | string
    type?: EnumNotificationTypeWithAggregatesFilter<"Notification"> | $Enums.NotificationType
    title?: StringWithAggregatesFilter<"Notification"> | string
    body?: StringWithAggregatesFilter<"Notification"> | string
    ticketId?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    isRead?: BoolWithAggregatesFilter<"Notification"> | boolean
    requiresAck?: BoolWithAggregatesFilter<"Notification"> | boolean
    acknowledgedAt?: DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type HelpRequestWhereInput = {
    AND?: HelpRequestWhereInput | HelpRequestWhereInput[]
    OR?: HelpRequestWhereInput[]
    NOT?: HelpRequestWhereInput | HelpRequestWhereInput[]
    id?: StringFilter<"HelpRequest"> | string
    requestedById?: StringFilter<"HelpRequest"> | string
    contextMessage?: StringFilter<"HelpRequest"> | string
    createdAt?: DateTimeFilter<"HelpRequest"> | Date | string
    requestedBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    responses?: HelpRequestResponseListRelationFilter
  }

  export type HelpRequestOrderByWithRelationInput = {
    id?: SortOrder
    requestedById?: SortOrder
    contextMessage?: SortOrder
    createdAt?: SortOrder
    requestedBy?: UserOrderByWithRelationInput
    responses?: HelpRequestResponseOrderByRelationAggregateInput
  }

  export type HelpRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: HelpRequestWhereInput | HelpRequestWhereInput[]
    OR?: HelpRequestWhereInput[]
    NOT?: HelpRequestWhereInput | HelpRequestWhereInput[]
    requestedById?: StringFilter<"HelpRequest"> | string
    contextMessage?: StringFilter<"HelpRequest"> | string
    createdAt?: DateTimeFilter<"HelpRequest"> | Date | string
    requestedBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    responses?: HelpRequestResponseListRelationFilter
  }, "id">

  export type HelpRequestOrderByWithAggregationInput = {
    id?: SortOrder
    requestedById?: SortOrder
    contextMessage?: SortOrder
    createdAt?: SortOrder
    _count?: HelpRequestCountOrderByAggregateInput
    _max?: HelpRequestMaxOrderByAggregateInput
    _min?: HelpRequestMinOrderByAggregateInput
  }

  export type HelpRequestScalarWhereWithAggregatesInput = {
    AND?: HelpRequestScalarWhereWithAggregatesInput | HelpRequestScalarWhereWithAggregatesInput[]
    OR?: HelpRequestScalarWhereWithAggregatesInput[]
    NOT?: HelpRequestScalarWhereWithAggregatesInput | HelpRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"HelpRequest"> | string
    requestedById?: StringWithAggregatesFilter<"HelpRequest"> | string
    contextMessage?: StringWithAggregatesFilter<"HelpRequest"> | string
    createdAt?: DateTimeWithAggregatesFilter<"HelpRequest"> | Date | string
  }

  export type HelpRequestResponseWhereInput = {
    AND?: HelpRequestResponseWhereInput | HelpRequestResponseWhereInput[]
    OR?: HelpRequestResponseWhereInput[]
    NOT?: HelpRequestResponseWhereInput | HelpRequestResponseWhereInput[]
    id?: StringFilter<"HelpRequestResponse"> | string
    helpRequestId?: StringFilter<"HelpRequestResponse"> | string
    responderId?: StringFilter<"HelpRequestResponse"> | string
    respondedAt?: DateTimeFilter<"HelpRequestResponse"> | Date | string
    helpRequest?: XOR<HelpRequestScalarRelationFilter, HelpRequestWhereInput>
    responder?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type HelpRequestResponseOrderByWithRelationInput = {
    id?: SortOrder
    helpRequestId?: SortOrder
    responderId?: SortOrder
    respondedAt?: SortOrder
    helpRequest?: HelpRequestOrderByWithRelationInput
    responder?: UserOrderByWithRelationInput
  }

  export type HelpRequestResponseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: HelpRequestResponseWhereInput | HelpRequestResponseWhereInput[]
    OR?: HelpRequestResponseWhereInput[]
    NOT?: HelpRequestResponseWhereInput | HelpRequestResponseWhereInput[]
    helpRequestId?: StringFilter<"HelpRequestResponse"> | string
    responderId?: StringFilter<"HelpRequestResponse"> | string
    respondedAt?: DateTimeFilter<"HelpRequestResponse"> | Date | string
    helpRequest?: XOR<HelpRequestScalarRelationFilter, HelpRequestWhereInput>
    responder?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type HelpRequestResponseOrderByWithAggregationInput = {
    id?: SortOrder
    helpRequestId?: SortOrder
    responderId?: SortOrder
    respondedAt?: SortOrder
    _count?: HelpRequestResponseCountOrderByAggregateInput
    _max?: HelpRequestResponseMaxOrderByAggregateInput
    _min?: HelpRequestResponseMinOrderByAggregateInput
  }

  export type HelpRequestResponseScalarWhereWithAggregatesInput = {
    AND?: HelpRequestResponseScalarWhereWithAggregatesInput | HelpRequestResponseScalarWhereWithAggregatesInput[]
    OR?: HelpRequestResponseScalarWhereWithAggregatesInput[]
    NOT?: HelpRequestResponseScalarWhereWithAggregatesInput | HelpRequestResponseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"HelpRequestResponse"> | string
    helpRequestId?: StringWithAggregatesFilter<"HelpRequestResponse"> | string
    responderId?: StringWithAggregatesFilter<"HelpRequestResponse"> | string
    respondedAt?: DateTimeWithAggregatesFilter<"HelpRequestResponse"> | Date | string
  }

  export type CheckpointWhereInput = {
    AND?: CheckpointWhereInput | CheckpointWhereInput[]
    OR?: CheckpointWhereInput[]
    NOT?: CheckpointWhereInput | CheckpointWhereInput[]
    id?: StringFilter<"Checkpoint"> | string
    userId?: StringFilter<"Checkpoint"> | string
    currentTask?: StringFilter<"Checkpoint"> | string
    isBlocked?: BoolFilter<"Checkpoint"> | boolean
    notes?: StringNullableFilter<"Checkpoint"> | string | null
    createdAt?: DateTimeFilter<"Checkpoint"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type CheckpointOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    currentTask?: SortOrder
    isBlocked?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type CheckpointWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CheckpointWhereInput | CheckpointWhereInput[]
    OR?: CheckpointWhereInput[]
    NOT?: CheckpointWhereInput | CheckpointWhereInput[]
    userId?: StringFilter<"Checkpoint"> | string
    currentTask?: StringFilter<"Checkpoint"> | string
    isBlocked?: BoolFilter<"Checkpoint"> | boolean
    notes?: StringNullableFilter<"Checkpoint"> | string | null
    createdAt?: DateTimeFilter<"Checkpoint"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type CheckpointOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    currentTask?: SortOrder
    isBlocked?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CheckpointCountOrderByAggregateInput
    _max?: CheckpointMaxOrderByAggregateInput
    _min?: CheckpointMinOrderByAggregateInput
  }

  export type CheckpointScalarWhereWithAggregatesInput = {
    AND?: CheckpointScalarWhereWithAggregatesInput | CheckpointScalarWhereWithAggregatesInput[]
    OR?: CheckpointScalarWhereWithAggregatesInput[]
    NOT?: CheckpointScalarWhereWithAggregatesInput | CheckpointScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Checkpoint"> | string
    userId?: StringWithAggregatesFilter<"Checkpoint"> | string
    currentTask?: StringWithAggregatesFilter<"Checkpoint"> | string
    isBlocked?: BoolWithAggregatesFilter<"Checkpoint"> | boolean
    notes?: StringNullableWithAggregatesFilter<"Checkpoint"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Checkpoint"> | Date | string
  }

  export type CheckpointConfigWhereInput = {
    AND?: CheckpointConfigWhereInput | CheckpointConfigWhereInput[]
    OR?: CheckpointConfigWhereInput[]
    NOT?: CheckpointConfigWhereInput | CheckpointConfigWhereInput[]
    id?: StringFilter<"CheckpointConfig"> | string
    intervalMinutes?: IntFilter<"CheckpointConfig"> | number
    activeHoursStart?: StringFilter<"CheckpointConfig"> | string
    activeHoursEnd?: StringFilter<"CheckpointConfig"> | string
    isEnabled?: BoolFilter<"CheckpointConfig"> | boolean
  }

  export type CheckpointConfigOrderByWithRelationInput = {
    id?: SortOrder
    intervalMinutes?: SortOrder
    activeHoursStart?: SortOrder
    activeHoursEnd?: SortOrder
    isEnabled?: SortOrder
  }

  export type CheckpointConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CheckpointConfigWhereInput | CheckpointConfigWhereInput[]
    OR?: CheckpointConfigWhereInput[]
    NOT?: CheckpointConfigWhereInput | CheckpointConfigWhereInput[]
    intervalMinutes?: IntFilter<"CheckpointConfig"> | number
    activeHoursStart?: StringFilter<"CheckpointConfig"> | string
    activeHoursEnd?: StringFilter<"CheckpointConfig"> | string
    isEnabled?: BoolFilter<"CheckpointConfig"> | boolean
  }, "id">

  export type CheckpointConfigOrderByWithAggregationInput = {
    id?: SortOrder
    intervalMinutes?: SortOrder
    activeHoursStart?: SortOrder
    activeHoursEnd?: SortOrder
    isEnabled?: SortOrder
    _count?: CheckpointConfigCountOrderByAggregateInput
    _avg?: CheckpointConfigAvgOrderByAggregateInput
    _max?: CheckpointConfigMaxOrderByAggregateInput
    _min?: CheckpointConfigMinOrderByAggregateInput
    _sum?: CheckpointConfigSumOrderByAggregateInput
  }

  export type CheckpointConfigScalarWhereWithAggregatesInput = {
    AND?: CheckpointConfigScalarWhereWithAggregatesInput | CheckpointConfigScalarWhereWithAggregatesInput[]
    OR?: CheckpointConfigScalarWhereWithAggregatesInput[]
    NOT?: CheckpointConfigScalarWhereWithAggregatesInput | CheckpointConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CheckpointConfig"> | string
    intervalMinutes?: IntWithAggregatesFilter<"CheckpointConfig"> | number
    activeHoursStart?: StringWithAggregatesFilter<"CheckpointConfig"> | string
    activeHoursEnd?: StringWithAggregatesFilter<"CheckpointConfig"> | string
    isEnabled?: BoolWithAggregatesFilter<"CheckpointConfig"> | boolean
  }

  export type TvConfigWhereInput = {
    AND?: TvConfigWhereInput | TvConfigWhereInput[]
    OR?: TvConfigWhereInput[]
    NOT?: TvConfigWhereInput | TvConfigWhereInput[]
    id?: StringFilter<"TvConfig"> | string
    isEnabled?: BoolFilter<"TvConfig"> | boolean
    refreshInterval?: IntFilter<"TvConfig"> | number
  }

  export type TvConfigOrderByWithRelationInput = {
    id?: SortOrder
    isEnabled?: SortOrder
    refreshInterval?: SortOrder
  }

  export type TvConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TvConfigWhereInput | TvConfigWhereInput[]
    OR?: TvConfigWhereInput[]
    NOT?: TvConfigWhereInput | TvConfigWhereInput[]
    isEnabled?: BoolFilter<"TvConfig"> | boolean
    refreshInterval?: IntFilter<"TvConfig"> | number
  }, "id">

  export type TvConfigOrderByWithAggregationInput = {
    id?: SortOrder
    isEnabled?: SortOrder
    refreshInterval?: SortOrder
    _count?: TvConfigCountOrderByAggregateInput
    _avg?: TvConfigAvgOrderByAggregateInput
    _max?: TvConfigMaxOrderByAggregateInput
    _min?: TvConfigMinOrderByAggregateInput
    _sum?: TvConfigSumOrderByAggregateInput
  }

  export type TvConfigScalarWhereWithAggregatesInput = {
    AND?: TvConfigScalarWhereWithAggregatesInput | TvConfigScalarWhereWithAggregatesInput[]
    OR?: TvConfigScalarWhereWithAggregatesInput[]
    NOT?: TvConfigScalarWhereWithAggregatesInput | TvConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TvConfig"> | string
    isEnabled?: BoolWithAggregatesFilter<"TvConfig"> | boolean
    refreshInterval?: IntWithAggregatesFilter<"TvConfig"> | number
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    openedTickets?: TicketCreateNestedManyWithoutOpenedByInput
    assignedTickets?: TicketCreateNestedManyWithoutAssignedToInput
    actorEvents?: TicketEventCreateNestedManyWithoutActorInput
    requestedReorders?: ReorderRequestCreateNestedManyWithoutRequestedByInput
    resolvedReorders?: ReorderRequestCreateNestedManyWithoutResolvedByInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    requestedHelp?: HelpRequestCreateNestedManyWithoutRequestedByInput
    helpResponses?: HelpRequestResponseCreateNestedManyWithoutResponderInput
    checkpoints?: CheckpointCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    openedTickets?: TicketUncheckedCreateNestedManyWithoutOpenedByInput
    assignedTickets?: TicketUncheckedCreateNestedManyWithoutAssignedToInput
    actorEvents?: TicketEventUncheckedCreateNestedManyWithoutActorInput
    requestedReorders?: ReorderRequestUncheckedCreateNestedManyWithoutRequestedByInput
    resolvedReorders?: ReorderRequestUncheckedCreateNestedManyWithoutResolvedByInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    requestedHelp?: HelpRequestUncheckedCreateNestedManyWithoutRequestedByInput
    helpResponses?: HelpRequestResponseUncheckedCreateNestedManyWithoutResponderInput
    checkpoints?: CheckpointUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    openedTickets?: TicketUpdateManyWithoutOpenedByNestedInput
    assignedTickets?: TicketUpdateManyWithoutAssignedToNestedInput
    actorEvents?: TicketEventUpdateManyWithoutActorNestedInput
    requestedReorders?: ReorderRequestUpdateManyWithoutRequestedByNestedInput
    resolvedReorders?: ReorderRequestUpdateManyWithoutResolvedByNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    requestedHelp?: HelpRequestUpdateManyWithoutRequestedByNestedInput
    helpResponses?: HelpRequestResponseUpdateManyWithoutResponderNestedInput
    checkpoints?: CheckpointUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    openedTickets?: TicketUncheckedUpdateManyWithoutOpenedByNestedInput
    assignedTickets?: TicketUncheckedUpdateManyWithoutAssignedToNestedInput
    actorEvents?: TicketEventUncheckedUpdateManyWithoutActorNestedInput
    requestedReorders?: ReorderRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    resolvedReorders?: ReorderRequestUncheckedUpdateManyWithoutResolvedByNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    requestedHelp?: HelpRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    helpResponses?: HelpRequestResponseUncheckedUpdateManyWithoutResponderNestedInput
    checkpoints?: CheckpointUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketCreateInput = {
    id?: string
    publicId: string
    title: string
    description: string
    type: $Enums.TicketType
    severity: $Enums.Severity
    status?: $Enums.TicketStatus
    deadline: Date | string
    priorityOrder: number
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
    openedBy: UserCreateNestedOneWithoutOpenedTicketsInput
    assignedTo?: UserCreateNestedOneWithoutAssignedTicketsInput
    bugReport?: BugReportCreateNestedOneWithoutTicketInput
    events?: TicketEventCreateNestedManyWithoutTicketInput
    reorderRequests?: ReorderRequestCreateNestedManyWithoutTicketInput
    notifications?: NotificationCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateInput = {
    id?: string
    publicId: string
    title: string
    description: string
    type: $Enums.TicketType
    severity: $Enums.Severity
    status?: $Enums.TicketStatus
    deadline: Date | string
    priorityOrder: number
    openedById: string
    assignedToId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
    bugReport?: BugReportUncheckedCreateNestedOneWithoutTicketInput
    events?: TicketEventUncheckedCreateNestedManyWithoutTicketInput
    reorderRequests?: ReorderRequestUncheckedCreateNestedManyWithoutTicketInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTicketTypeFieldUpdateOperationsInput | $Enums.TicketType
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    priorityOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openedBy?: UserUpdateOneRequiredWithoutOpenedTicketsNestedInput
    assignedTo?: UserUpdateOneWithoutAssignedTicketsNestedInput
    bugReport?: BugReportUpdateOneWithoutTicketNestedInput
    events?: TicketEventUpdateManyWithoutTicketNestedInput
    reorderRequests?: ReorderRequestUpdateManyWithoutTicketNestedInput
    notifications?: NotificationUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTicketTypeFieldUpdateOperationsInput | $Enums.TicketType
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    priorityOrder?: IntFieldUpdateOperationsInput | number
    openedById?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bugReport?: BugReportUncheckedUpdateOneWithoutTicketNestedInput
    events?: TicketEventUncheckedUpdateManyWithoutTicketNestedInput
    reorderRequests?: ReorderRequestUncheckedUpdateManyWithoutTicketNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type TicketCreateManyInput = {
    id?: string
    publicId: string
    title: string
    description: string
    type: $Enums.TicketType
    severity: $Enums.Severity
    status?: $Enums.TicketStatus
    deadline: Date | string
    priorityOrder: number
    openedById: string
    assignedToId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
  }

  export type TicketUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTicketTypeFieldUpdateOperationsInput | $Enums.TicketType
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    priorityOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TicketUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTicketTypeFieldUpdateOperationsInput | $Enums.TicketType
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    priorityOrder?: IntFieldUpdateOperationsInput | number
    openedById?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BugReportCreateInput = {
    id?: string
    affectedModule: string
    stepsToReproduce: string
    expectedBehavior: string
    actualBehavior: string
    environment: $Enums.Environment
    customerId?: string | null
    ticket: TicketCreateNestedOneWithoutBugReportInput
  }

  export type BugReportUncheckedCreateInput = {
    id?: string
    ticketId: string
    affectedModule: string
    stepsToReproduce: string
    expectedBehavior: string
    actualBehavior: string
    environment: $Enums.Environment
    customerId?: string | null
  }

  export type BugReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    affectedModule?: StringFieldUpdateOperationsInput | string
    stepsToReproduce?: StringFieldUpdateOperationsInput | string
    expectedBehavior?: StringFieldUpdateOperationsInput | string
    actualBehavior?: StringFieldUpdateOperationsInput | string
    environment?: EnumEnvironmentFieldUpdateOperationsInput | $Enums.Environment
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    ticket?: TicketUpdateOneRequiredWithoutBugReportNestedInput
  }

  export type BugReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    affectedModule?: StringFieldUpdateOperationsInput | string
    stepsToReproduce?: StringFieldUpdateOperationsInput | string
    expectedBehavior?: StringFieldUpdateOperationsInput | string
    actualBehavior?: StringFieldUpdateOperationsInput | string
    environment?: EnumEnvironmentFieldUpdateOperationsInput | $Enums.Environment
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BugReportCreateManyInput = {
    id?: string
    ticketId: string
    affectedModule: string
    stepsToReproduce: string
    expectedBehavior: string
    actualBehavior: string
    environment: $Enums.Environment
    customerId?: string | null
  }

  export type BugReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    affectedModule?: StringFieldUpdateOperationsInput | string
    stepsToReproduce?: StringFieldUpdateOperationsInput | string
    expectedBehavior?: StringFieldUpdateOperationsInput | string
    actualBehavior?: StringFieldUpdateOperationsInput | string
    environment?: EnumEnvironmentFieldUpdateOperationsInput | $Enums.Environment
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BugReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    affectedModule?: StringFieldUpdateOperationsInput | string
    stepsToReproduce?: StringFieldUpdateOperationsInput | string
    expectedBehavior?: StringFieldUpdateOperationsInput | string
    actualBehavior?: StringFieldUpdateOperationsInput | string
    environment?: EnumEnvironmentFieldUpdateOperationsInput | $Enums.Environment
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TicketEventCreateInput = {
    id?: string
    eventType: $Enums.TicketEventType
    metadata?: string
    createdAt?: Date | string
    ticket: TicketCreateNestedOneWithoutEventsInput
    actor: UserCreateNestedOneWithoutActorEventsInput
  }

  export type TicketEventUncheckedCreateInput = {
    id?: string
    ticketId: string
    eventType: $Enums.TicketEventType
    actorId: string
    metadata?: string
    createdAt?: Date | string
  }

  export type TicketEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: EnumTicketEventTypeFieldUpdateOperationsInput | $Enums.TicketEventType
    metadata?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticket?: TicketUpdateOneRequiredWithoutEventsNestedInput
    actor?: UserUpdateOneRequiredWithoutActorEventsNestedInput
  }

  export type TicketEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    eventType?: EnumTicketEventTypeFieldUpdateOperationsInput | $Enums.TicketEventType
    actorId?: StringFieldUpdateOperationsInput | string
    metadata?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketEventCreateManyInput = {
    id?: string
    ticketId: string
    eventType: $Enums.TicketEventType
    actorId: string
    metadata?: string
    createdAt?: Date | string
  }

  export type TicketEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: EnumTicketEventTypeFieldUpdateOperationsInput | $Enums.TicketEventType
    metadata?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    eventType?: EnumTicketEventTypeFieldUpdateOperationsInput | $Enums.TicketEventType
    actorId?: StringFieldUpdateOperationsInput | string
    metadata?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReorderRequestCreateInput = {
    id?: string
    requestedPosition: number
    reason?: string | null
    status?: $Enums.ReorderStatus
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    ticket: TicketCreateNestedOneWithoutReorderRequestsInput
    requestedBy: UserCreateNestedOneWithoutRequestedReordersInput
    resolvedBy?: UserCreateNestedOneWithoutResolvedReordersInput
  }

  export type ReorderRequestUncheckedCreateInput = {
    id?: string
    ticketId: string
    requestedById: string
    requestedPosition: number
    reason?: string | null
    status?: $Enums.ReorderStatus
    resolvedById?: string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ReorderRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedPosition?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReorderStatusFieldUpdateOperationsInput | $Enums.ReorderStatus
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticket?: TicketUpdateOneRequiredWithoutReorderRequestsNestedInput
    requestedBy?: UserUpdateOneRequiredWithoutRequestedReordersNestedInput
    resolvedBy?: UserUpdateOneWithoutResolvedReordersNestedInput
  }

  export type ReorderRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    requestedById?: StringFieldUpdateOperationsInput | string
    requestedPosition?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReorderStatusFieldUpdateOperationsInput | $Enums.ReorderStatus
    resolvedById?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReorderRequestCreateManyInput = {
    id?: string
    ticketId: string
    requestedById: string
    requestedPosition: number
    reason?: string | null
    status?: $Enums.ReorderStatus
    resolvedById?: string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ReorderRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedPosition?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReorderStatusFieldUpdateOperationsInput | $Enums.ReorderStatus
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReorderRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    requestedById?: StringFieldUpdateOperationsInput | string
    requestedPosition?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReorderStatusFieldUpdateOperationsInput | $Enums.ReorderStatus
    resolvedById?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateInput = {
    id?: string
    type: $Enums.NotificationType
    title: string
    body: string
    isRead?: boolean
    requiresAck?: boolean
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
    ticket?: TicketCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    userId: string
    type: $Enums.NotificationType
    title: string
    body: string
    ticketId?: string | null
    isRead?: boolean
    requiresAck?: boolean
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    requiresAck?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
    ticket?: TicketUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    ticketId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    requiresAck?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    userId: string
    type: $Enums.NotificationType
    title: string
    body: string
    ticketId?: string | null
    isRead?: boolean
    requiresAck?: boolean
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    requiresAck?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    ticketId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    requiresAck?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HelpRequestCreateInput = {
    id?: string
    contextMessage: string
    createdAt?: Date | string
    requestedBy: UserCreateNestedOneWithoutRequestedHelpInput
    responses?: HelpRequestResponseCreateNestedManyWithoutHelpRequestInput
  }

  export type HelpRequestUncheckedCreateInput = {
    id?: string
    requestedById: string
    contextMessage: string
    createdAt?: Date | string
    responses?: HelpRequestResponseUncheckedCreateNestedManyWithoutHelpRequestInput
  }

  export type HelpRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    contextMessage?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: UserUpdateOneRequiredWithoutRequestedHelpNestedInput
    responses?: HelpRequestResponseUpdateManyWithoutHelpRequestNestedInput
  }

  export type HelpRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedById?: StringFieldUpdateOperationsInput | string
    contextMessage?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    responses?: HelpRequestResponseUncheckedUpdateManyWithoutHelpRequestNestedInput
  }

  export type HelpRequestCreateManyInput = {
    id?: string
    requestedById: string
    contextMessage: string
    createdAt?: Date | string
  }

  export type HelpRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    contextMessage?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HelpRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedById?: StringFieldUpdateOperationsInput | string
    contextMessage?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HelpRequestResponseCreateInput = {
    id?: string
    respondedAt?: Date | string
    helpRequest: HelpRequestCreateNestedOneWithoutResponsesInput
    responder: UserCreateNestedOneWithoutHelpResponsesInput
  }

  export type HelpRequestResponseUncheckedCreateInput = {
    id?: string
    helpRequestId: string
    responderId: string
    respondedAt?: Date | string
  }

  export type HelpRequestResponseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    respondedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    helpRequest?: HelpRequestUpdateOneRequiredWithoutResponsesNestedInput
    responder?: UserUpdateOneRequiredWithoutHelpResponsesNestedInput
  }

  export type HelpRequestResponseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    helpRequestId?: StringFieldUpdateOperationsInput | string
    responderId?: StringFieldUpdateOperationsInput | string
    respondedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HelpRequestResponseCreateManyInput = {
    id?: string
    helpRequestId: string
    responderId: string
    respondedAt?: Date | string
  }

  export type HelpRequestResponseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    respondedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HelpRequestResponseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    helpRequestId?: StringFieldUpdateOperationsInput | string
    responderId?: StringFieldUpdateOperationsInput | string
    respondedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CheckpointCreateInput = {
    id?: string
    currentTask: string
    isBlocked: boolean
    notes?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutCheckpointsInput
  }

  export type CheckpointUncheckedCreateInput = {
    id?: string
    userId: string
    currentTask: string
    isBlocked: boolean
    notes?: string | null
    createdAt?: Date | string
  }

  export type CheckpointUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentTask?: StringFieldUpdateOperationsInput | string
    isBlocked?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCheckpointsNestedInput
  }

  export type CheckpointUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    currentTask?: StringFieldUpdateOperationsInput | string
    isBlocked?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CheckpointCreateManyInput = {
    id?: string
    userId: string
    currentTask: string
    isBlocked: boolean
    notes?: string | null
    createdAt?: Date | string
  }

  export type CheckpointUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentTask?: StringFieldUpdateOperationsInput | string
    isBlocked?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CheckpointUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    currentTask?: StringFieldUpdateOperationsInput | string
    isBlocked?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CheckpointConfigCreateInput = {
    id?: string
    intervalMinutes?: number
    activeHoursStart?: string
    activeHoursEnd?: string
    isEnabled?: boolean
  }

  export type CheckpointConfigUncheckedCreateInput = {
    id?: string
    intervalMinutes?: number
    activeHoursStart?: string
    activeHoursEnd?: string
    isEnabled?: boolean
  }

  export type CheckpointConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    intervalMinutes?: IntFieldUpdateOperationsInput | number
    activeHoursStart?: StringFieldUpdateOperationsInput | string
    activeHoursEnd?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CheckpointConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    intervalMinutes?: IntFieldUpdateOperationsInput | number
    activeHoursStart?: StringFieldUpdateOperationsInput | string
    activeHoursEnd?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CheckpointConfigCreateManyInput = {
    id?: string
    intervalMinutes?: number
    activeHoursStart?: string
    activeHoursEnd?: string
    isEnabled?: boolean
  }

  export type CheckpointConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    intervalMinutes?: IntFieldUpdateOperationsInput | number
    activeHoursStart?: StringFieldUpdateOperationsInput | string
    activeHoursEnd?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CheckpointConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    intervalMinutes?: IntFieldUpdateOperationsInput | number
    activeHoursStart?: StringFieldUpdateOperationsInput | string
    activeHoursEnd?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TvConfigCreateInput = {
    id?: string
    isEnabled?: boolean
    refreshInterval?: number
  }

  export type TvConfigUncheckedCreateInput = {
    id?: string
    isEnabled?: boolean
    refreshInterval?: number
  }

  export type TvConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    refreshInterval?: IntFieldUpdateOperationsInput | number
  }

  export type TvConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    refreshInterval?: IntFieldUpdateOperationsInput | number
  }

  export type TvConfigCreateManyInput = {
    id?: string
    isEnabled?: boolean
    refreshInterval?: number
  }

  export type TvConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    refreshInterval?: IntFieldUpdateOperationsInput | number
  }

  export type TvConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    refreshInterval?: IntFieldUpdateOperationsInput | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EnumDevStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.DevStatus | EnumDevStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.DevStatus[] | null
    notIn?: $Enums.DevStatus[] | null
    not?: NestedEnumDevStatusNullableFilter<$PrismaModel> | $Enums.DevStatus | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TicketListRelationFilter = {
    every?: TicketWhereInput
    some?: TicketWhereInput
    none?: TicketWhereInput
  }

  export type TicketEventListRelationFilter = {
    every?: TicketEventWhereInput
    some?: TicketEventWhereInput
    none?: TicketEventWhereInput
  }

  export type ReorderRequestListRelationFilter = {
    every?: ReorderRequestWhereInput
    some?: ReorderRequestWhereInput
    none?: ReorderRequestWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type HelpRequestListRelationFilter = {
    every?: HelpRequestWhereInput
    some?: HelpRequestWhereInput
    none?: HelpRequestWhereInput
  }

  export type HelpRequestResponseListRelationFilter = {
    every?: HelpRequestResponseWhereInput
    some?: HelpRequestResponseWhereInput
    none?: HelpRequestResponseWhereInput
  }

  export type CheckpointListRelationFilter = {
    every?: CheckpointWhereInput
    some?: CheckpointWhereInput
    none?: CheckpointWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TicketOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TicketEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReorderRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type HelpRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type HelpRequestResponseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CheckpointOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    avatarUrl?: SortOrder
    ninjaAlias?: SortOrder
    isActive?: SortOrder
    notifyTickets?: SortOrder
    notifyBugs?: SortOrder
    soundEnabled?: SortOrder
    devStatus?: SortOrder
    currentTask?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    avatarUrl?: SortOrder
    ninjaAlias?: SortOrder
    isActive?: SortOrder
    notifyTickets?: SortOrder
    notifyBugs?: SortOrder
    soundEnabled?: SortOrder
    devStatus?: SortOrder
    currentTask?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    avatarUrl?: SortOrder
    ninjaAlias?: SortOrder
    isActive?: SortOrder
    notifyTickets?: SortOrder
    notifyBugs?: SortOrder
    soundEnabled?: SortOrder
    devStatus?: SortOrder
    currentTask?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
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

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumDevStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DevStatus | EnumDevStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.DevStatus[] | null
    notIn?: $Enums.DevStatus[] | null
    not?: NestedEnumDevStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.DevStatus | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumDevStatusNullableFilter<$PrismaModel>
    _max?: NestedEnumDevStatusNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumTicketTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketType | EnumTicketTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TicketType[]
    notIn?: $Enums.TicketType[]
    not?: NestedEnumTicketTypeFilter<$PrismaModel> | $Enums.TicketType
  }

  export type EnumSeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.Severity | EnumSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.Severity[]
    notIn?: $Enums.Severity[]
    not?: NestedEnumSeverityFilter<$PrismaModel> | $Enums.Severity
  }

  export type EnumTicketStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[]
    notIn?: $Enums.TicketStatus[]
    not?: NestedEnumTicketStatusFilter<$PrismaModel> | $Enums.TicketStatus
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type BugReportNullableScalarRelationFilter = {
    is?: BugReportWhereInput | null
    isNot?: BugReportWhereInput | null
  }

  export type TicketCountOrderByAggregateInput = {
    id?: SortOrder
    publicId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    deadline?: SortOrder
    priorityOrder?: SortOrder
    openedById?: SortOrder
    assignedToId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resolvedAt?: SortOrder
  }

  export type TicketAvgOrderByAggregateInput = {
    priorityOrder?: SortOrder
  }

  export type TicketMaxOrderByAggregateInput = {
    id?: SortOrder
    publicId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    deadline?: SortOrder
    priorityOrder?: SortOrder
    openedById?: SortOrder
    assignedToId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resolvedAt?: SortOrder
  }

  export type TicketMinOrderByAggregateInput = {
    id?: SortOrder
    publicId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    deadline?: SortOrder
    priorityOrder?: SortOrder
    openedById?: SortOrder
    assignedToId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resolvedAt?: SortOrder
  }

  export type TicketSumOrderByAggregateInput = {
    priorityOrder?: SortOrder
  }

  export type EnumTicketTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketType | EnumTicketTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TicketType[]
    notIn?: $Enums.TicketType[]
    not?: NestedEnumTicketTypeWithAggregatesFilter<$PrismaModel> | $Enums.TicketType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTicketTypeFilter<$PrismaModel>
    _max?: NestedEnumTicketTypeFilter<$PrismaModel>
  }

  export type EnumSeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Severity | EnumSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.Severity[]
    notIn?: $Enums.Severity[]
    not?: NestedEnumSeverityWithAggregatesFilter<$PrismaModel> | $Enums.Severity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSeverityFilter<$PrismaModel>
    _max?: NestedEnumSeverityFilter<$PrismaModel>
  }

  export type EnumTicketStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[]
    notIn?: $Enums.TicketStatus[]
    not?: NestedEnumTicketStatusWithAggregatesFilter<$PrismaModel> | $Enums.TicketStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTicketStatusFilter<$PrismaModel>
    _max?: NestedEnumTicketStatusFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
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

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumEnvironmentFilter<$PrismaModel = never> = {
    equals?: $Enums.Environment | EnumEnvironmentFieldRefInput<$PrismaModel>
    in?: $Enums.Environment[]
    notIn?: $Enums.Environment[]
    not?: NestedEnumEnvironmentFilter<$PrismaModel> | $Enums.Environment
  }

  export type TicketScalarRelationFilter = {
    is?: TicketWhereInput
    isNot?: TicketWhereInput
  }

  export type BugReportCountOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    affectedModule?: SortOrder
    stepsToReproduce?: SortOrder
    expectedBehavior?: SortOrder
    actualBehavior?: SortOrder
    environment?: SortOrder
    customerId?: SortOrder
  }

  export type BugReportMaxOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    affectedModule?: SortOrder
    stepsToReproduce?: SortOrder
    expectedBehavior?: SortOrder
    actualBehavior?: SortOrder
    environment?: SortOrder
    customerId?: SortOrder
  }

  export type BugReportMinOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    affectedModule?: SortOrder
    stepsToReproduce?: SortOrder
    expectedBehavior?: SortOrder
    actualBehavior?: SortOrder
    environment?: SortOrder
    customerId?: SortOrder
  }

  export type EnumEnvironmentWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Environment | EnumEnvironmentFieldRefInput<$PrismaModel>
    in?: $Enums.Environment[]
    notIn?: $Enums.Environment[]
    not?: NestedEnumEnvironmentWithAggregatesFilter<$PrismaModel> | $Enums.Environment
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEnvironmentFilter<$PrismaModel>
    _max?: NestedEnumEnvironmentFilter<$PrismaModel>
  }

  export type EnumTicketEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketEventType | EnumTicketEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TicketEventType[]
    notIn?: $Enums.TicketEventType[]
    not?: NestedEnumTicketEventTypeFilter<$PrismaModel> | $Enums.TicketEventType
  }

  export type TicketEventCountOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type TicketEventMaxOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type TicketEventMinOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumTicketEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketEventType | EnumTicketEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TicketEventType[]
    notIn?: $Enums.TicketEventType[]
    not?: NestedEnumTicketEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.TicketEventType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTicketEventTypeFilter<$PrismaModel>
    _max?: NestedEnumTicketEventTypeFilter<$PrismaModel>
  }

  export type EnumReorderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReorderStatus | EnumReorderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReorderStatus[]
    notIn?: $Enums.ReorderStatus[]
    not?: NestedEnumReorderStatusFilter<$PrismaModel> | $Enums.ReorderStatus
  }

  export type ReorderRequestCountOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    requestedById?: SortOrder
    requestedPosition?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    resolvedById?: SortOrder
    resolvedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ReorderRequestAvgOrderByAggregateInput = {
    requestedPosition?: SortOrder
  }

  export type ReorderRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    requestedById?: SortOrder
    requestedPosition?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    resolvedById?: SortOrder
    resolvedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ReorderRequestMinOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    requestedById?: SortOrder
    requestedPosition?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    resolvedById?: SortOrder
    resolvedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ReorderRequestSumOrderByAggregateInput = {
    requestedPosition?: SortOrder
  }

  export type EnumReorderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReorderStatus | EnumReorderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReorderStatus[]
    notIn?: $Enums.ReorderStatus[]
    not?: NestedEnumReorderStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReorderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReorderStatusFilter<$PrismaModel>
    _max?: NestedEnumReorderStatusFilter<$PrismaModel>
  }

  export type EnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[]
    notIn?: $Enums.NotificationType[]
    not?: NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType
  }

  export type TicketNullableScalarRelationFilter = {
    is?: TicketWhereInput | null
    isNot?: TicketWhereInput | null
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    ticketId?: SortOrder
    isRead?: SortOrder
    requiresAck?: SortOrder
    acknowledgedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    ticketId?: SortOrder
    isRead?: SortOrder
    requiresAck?: SortOrder
    acknowledgedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    ticketId?: SortOrder
    isRead?: SortOrder
    requiresAck?: SortOrder
    acknowledgedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[]
    notIn?: $Enums.NotificationType[]
    not?: NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>
  }

  export type HelpRequestCountOrderByAggregateInput = {
    id?: SortOrder
    requestedById?: SortOrder
    contextMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type HelpRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    requestedById?: SortOrder
    contextMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type HelpRequestMinOrderByAggregateInput = {
    id?: SortOrder
    requestedById?: SortOrder
    contextMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type HelpRequestScalarRelationFilter = {
    is?: HelpRequestWhereInput
    isNot?: HelpRequestWhereInput
  }

  export type HelpRequestResponseCountOrderByAggregateInput = {
    id?: SortOrder
    helpRequestId?: SortOrder
    responderId?: SortOrder
    respondedAt?: SortOrder
  }

  export type HelpRequestResponseMaxOrderByAggregateInput = {
    id?: SortOrder
    helpRequestId?: SortOrder
    responderId?: SortOrder
    respondedAt?: SortOrder
  }

  export type HelpRequestResponseMinOrderByAggregateInput = {
    id?: SortOrder
    helpRequestId?: SortOrder
    responderId?: SortOrder
    respondedAt?: SortOrder
  }

  export type CheckpointCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    currentTask?: SortOrder
    isBlocked?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type CheckpointMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    currentTask?: SortOrder
    isBlocked?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type CheckpointMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    currentTask?: SortOrder
    isBlocked?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type CheckpointConfigCountOrderByAggregateInput = {
    id?: SortOrder
    intervalMinutes?: SortOrder
    activeHoursStart?: SortOrder
    activeHoursEnd?: SortOrder
    isEnabled?: SortOrder
  }

  export type CheckpointConfigAvgOrderByAggregateInput = {
    intervalMinutes?: SortOrder
  }

  export type CheckpointConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    intervalMinutes?: SortOrder
    activeHoursStart?: SortOrder
    activeHoursEnd?: SortOrder
    isEnabled?: SortOrder
  }

  export type CheckpointConfigMinOrderByAggregateInput = {
    id?: SortOrder
    intervalMinutes?: SortOrder
    activeHoursStart?: SortOrder
    activeHoursEnd?: SortOrder
    isEnabled?: SortOrder
  }

  export type CheckpointConfigSumOrderByAggregateInput = {
    intervalMinutes?: SortOrder
  }

  export type TvConfigCountOrderByAggregateInput = {
    id?: SortOrder
    isEnabled?: SortOrder
    refreshInterval?: SortOrder
  }

  export type TvConfigAvgOrderByAggregateInput = {
    refreshInterval?: SortOrder
  }

  export type TvConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    isEnabled?: SortOrder
    refreshInterval?: SortOrder
  }

  export type TvConfigMinOrderByAggregateInput = {
    id?: SortOrder
    isEnabled?: SortOrder
    refreshInterval?: SortOrder
  }

  export type TvConfigSumOrderByAggregateInput = {
    refreshInterval?: SortOrder
  }

  export type TicketCreateNestedManyWithoutOpenedByInput = {
    create?: XOR<TicketCreateWithoutOpenedByInput, TicketUncheckedCreateWithoutOpenedByInput> | TicketCreateWithoutOpenedByInput[] | TicketUncheckedCreateWithoutOpenedByInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutOpenedByInput | TicketCreateOrConnectWithoutOpenedByInput[]
    createMany?: TicketCreateManyOpenedByInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type TicketCreateNestedManyWithoutAssignedToInput = {
    create?: XOR<TicketCreateWithoutAssignedToInput, TicketUncheckedCreateWithoutAssignedToInput> | TicketCreateWithoutAssignedToInput[] | TicketUncheckedCreateWithoutAssignedToInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutAssignedToInput | TicketCreateOrConnectWithoutAssignedToInput[]
    createMany?: TicketCreateManyAssignedToInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type TicketEventCreateNestedManyWithoutActorInput = {
    create?: XOR<TicketEventCreateWithoutActorInput, TicketEventUncheckedCreateWithoutActorInput> | TicketEventCreateWithoutActorInput[] | TicketEventUncheckedCreateWithoutActorInput[]
    connectOrCreate?: TicketEventCreateOrConnectWithoutActorInput | TicketEventCreateOrConnectWithoutActorInput[]
    createMany?: TicketEventCreateManyActorInputEnvelope
    connect?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
  }

  export type ReorderRequestCreateNestedManyWithoutRequestedByInput = {
    create?: XOR<ReorderRequestCreateWithoutRequestedByInput, ReorderRequestUncheckedCreateWithoutRequestedByInput> | ReorderRequestCreateWithoutRequestedByInput[] | ReorderRequestUncheckedCreateWithoutRequestedByInput[]
    connectOrCreate?: ReorderRequestCreateOrConnectWithoutRequestedByInput | ReorderRequestCreateOrConnectWithoutRequestedByInput[]
    createMany?: ReorderRequestCreateManyRequestedByInputEnvelope
    connect?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
  }

  export type ReorderRequestCreateNestedManyWithoutResolvedByInput = {
    create?: XOR<ReorderRequestCreateWithoutResolvedByInput, ReorderRequestUncheckedCreateWithoutResolvedByInput> | ReorderRequestCreateWithoutResolvedByInput[] | ReorderRequestUncheckedCreateWithoutResolvedByInput[]
    connectOrCreate?: ReorderRequestCreateOrConnectWithoutResolvedByInput | ReorderRequestCreateOrConnectWithoutResolvedByInput[]
    createMany?: ReorderRequestCreateManyResolvedByInputEnvelope
    connect?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type HelpRequestCreateNestedManyWithoutRequestedByInput = {
    create?: XOR<HelpRequestCreateWithoutRequestedByInput, HelpRequestUncheckedCreateWithoutRequestedByInput> | HelpRequestCreateWithoutRequestedByInput[] | HelpRequestUncheckedCreateWithoutRequestedByInput[]
    connectOrCreate?: HelpRequestCreateOrConnectWithoutRequestedByInput | HelpRequestCreateOrConnectWithoutRequestedByInput[]
    createMany?: HelpRequestCreateManyRequestedByInputEnvelope
    connect?: HelpRequestWhereUniqueInput | HelpRequestWhereUniqueInput[]
  }

  export type HelpRequestResponseCreateNestedManyWithoutResponderInput = {
    create?: XOR<HelpRequestResponseCreateWithoutResponderInput, HelpRequestResponseUncheckedCreateWithoutResponderInput> | HelpRequestResponseCreateWithoutResponderInput[] | HelpRequestResponseUncheckedCreateWithoutResponderInput[]
    connectOrCreate?: HelpRequestResponseCreateOrConnectWithoutResponderInput | HelpRequestResponseCreateOrConnectWithoutResponderInput[]
    createMany?: HelpRequestResponseCreateManyResponderInputEnvelope
    connect?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
  }

  export type CheckpointCreateNestedManyWithoutUserInput = {
    create?: XOR<CheckpointCreateWithoutUserInput, CheckpointUncheckedCreateWithoutUserInput> | CheckpointCreateWithoutUserInput[] | CheckpointUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CheckpointCreateOrConnectWithoutUserInput | CheckpointCreateOrConnectWithoutUserInput[]
    createMany?: CheckpointCreateManyUserInputEnvelope
    connect?: CheckpointWhereUniqueInput | CheckpointWhereUniqueInput[]
  }

  export type TicketUncheckedCreateNestedManyWithoutOpenedByInput = {
    create?: XOR<TicketCreateWithoutOpenedByInput, TicketUncheckedCreateWithoutOpenedByInput> | TicketCreateWithoutOpenedByInput[] | TicketUncheckedCreateWithoutOpenedByInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutOpenedByInput | TicketCreateOrConnectWithoutOpenedByInput[]
    createMany?: TicketCreateManyOpenedByInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type TicketUncheckedCreateNestedManyWithoutAssignedToInput = {
    create?: XOR<TicketCreateWithoutAssignedToInput, TicketUncheckedCreateWithoutAssignedToInput> | TicketCreateWithoutAssignedToInput[] | TicketUncheckedCreateWithoutAssignedToInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutAssignedToInput | TicketCreateOrConnectWithoutAssignedToInput[]
    createMany?: TicketCreateManyAssignedToInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type TicketEventUncheckedCreateNestedManyWithoutActorInput = {
    create?: XOR<TicketEventCreateWithoutActorInput, TicketEventUncheckedCreateWithoutActorInput> | TicketEventCreateWithoutActorInput[] | TicketEventUncheckedCreateWithoutActorInput[]
    connectOrCreate?: TicketEventCreateOrConnectWithoutActorInput | TicketEventCreateOrConnectWithoutActorInput[]
    createMany?: TicketEventCreateManyActorInputEnvelope
    connect?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
  }

  export type ReorderRequestUncheckedCreateNestedManyWithoutRequestedByInput = {
    create?: XOR<ReorderRequestCreateWithoutRequestedByInput, ReorderRequestUncheckedCreateWithoutRequestedByInput> | ReorderRequestCreateWithoutRequestedByInput[] | ReorderRequestUncheckedCreateWithoutRequestedByInput[]
    connectOrCreate?: ReorderRequestCreateOrConnectWithoutRequestedByInput | ReorderRequestCreateOrConnectWithoutRequestedByInput[]
    createMany?: ReorderRequestCreateManyRequestedByInputEnvelope
    connect?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
  }

  export type ReorderRequestUncheckedCreateNestedManyWithoutResolvedByInput = {
    create?: XOR<ReorderRequestCreateWithoutResolvedByInput, ReorderRequestUncheckedCreateWithoutResolvedByInput> | ReorderRequestCreateWithoutResolvedByInput[] | ReorderRequestUncheckedCreateWithoutResolvedByInput[]
    connectOrCreate?: ReorderRequestCreateOrConnectWithoutResolvedByInput | ReorderRequestCreateOrConnectWithoutResolvedByInput[]
    createMany?: ReorderRequestCreateManyResolvedByInputEnvelope
    connect?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type HelpRequestUncheckedCreateNestedManyWithoutRequestedByInput = {
    create?: XOR<HelpRequestCreateWithoutRequestedByInput, HelpRequestUncheckedCreateWithoutRequestedByInput> | HelpRequestCreateWithoutRequestedByInput[] | HelpRequestUncheckedCreateWithoutRequestedByInput[]
    connectOrCreate?: HelpRequestCreateOrConnectWithoutRequestedByInput | HelpRequestCreateOrConnectWithoutRequestedByInput[]
    createMany?: HelpRequestCreateManyRequestedByInputEnvelope
    connect?: HelpRequestWhereUniqueInput | HelpRequestWhereUniqueInput[]
  }

  export type HelpRequestResponseUncheckedCreateNestedManyWithoutResponderInput = {
    create?: XOR<HelpRequestResponseCreateWithoutResponderInput, HelpRequestResponseUncheckedCreateWithoutResponderInput> | HelpRequestResponseCreateWithoutResponderInput[] | HelpRequestResponseUncheckedCreateWithoutResponderInput[]
    connectOrCreate?: HelpRequestResponseCreateOrConnectWithoutResponderInput | HelpRequestResponseCreateOrConnectWithoutResponderInput[]
    createMany?: HelpRequestResponseCreateManyResponderInputEnvelope
    connect?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
  }

  export type CheckpointUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CheckpointCreateWithoutUserInput, CheckpointUncheckedCreateWithoutUserInput> | CheckpointCreateWithoutUserInput[] | CheckpointUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CheckpointCreateOrConnectWithoutUserInput | CheckpointCreateOrConnectWithoutUserInput[]
    createMany?: CheckpointCreateManyUserInputEnvelope
    connect?: CheckpointWhereUniqueInput | CheckpointWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableEnumDevStatusFieldUpdateOperationsInput = {
    set?: $Enums.DevStatus | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TicketUpdateManyWithoutOpenedByNestedInput = {
    create?: XOR<TicketCreateWithoutOpenedByInput, TicketUncheckedCreateWithoutOpenedByInput> | TicketCreateWithoutOpenedByInput[] | TicketUncheckedCreateWithoutOpenedByInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutOpenedByInput | TicketCreateOrConnectWithoutOpenedByInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutOpenedByInput | TicketUpsertWithWhereUniqueWithoutOpenedByInput[]
    createMany?: TicketCreateManyOpenedByInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutOpenedByInput | TicketUpdateWithWhereUniqueWithoutOpenedByInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutOpenedByInput | TicketUpdateManyWithWhereWithoutOpenedByInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type TicketUpdateManyWithoutAssignedToNestedInput = {
    create?: XOR<TicketCreateWithoutAssignedToInput, TicketUncheckedCreateWithoutAssignedToInput> | TicketCreateWithoutAssignedToInput[] | TicketUncheckedCreateWithoutAssignedToInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutAssignedToInput | TicketCreateOrConnectWithoutAssignedToInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutAssignedToInput | TicketUpsertWithWhereUniqueWithoutAssignedToInput[]
    createMany?: TicketCreateManyAssignedToInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutAssignedToInput | TicketUpdateWithWhereUniqueWithoutAssignedToInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutAssignedToInput | TicketUpdateManyWithWhereWithoutAssignedToInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type TicketEventUpdateManyWithoutActorNestedInput = {
    create?: XOR<TicketEventCreateWithoutActorInput, TicketEventUncheckedCreateWithoutActorInput> | TicketEventCreateWithoutActorInput[] | TicketEventUncheckedCreateWithoutActorInput[]
    connectOrCreate?: TicketEventCreateOrConnectWithoutActorInput | TicketEventCreateOrConnectWithoutActorInput[]
    upsert?: TicketEventUpsertWithWhereUniqueWithoutActorInput | TicketEventUpsertWithWhereUniqueWithoutActorInput[]
    createMany?: TicketEventCreateManyActorInputEnvelope
    set?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
    disconnect?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
    delete?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
    connect?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
    update?: TicketEventUpdateWithWhereUniqueWithoutActorInput | TicketEventUpdateWithWhereUniqueWithoutActorInput[]
    updateMany?: TicketEventUpdateManyWithWhereWithoutActorInput | TicketEventUpdateManyWithWhereWithoutActorInput[]
    deleteMany?: TicketEventScalarWhereInput | TicketEventScalarWhereInput[]
  }

  export type ReorderRequestUpdateManyWithoutRequestedByNestedInput = {
    create?: XOR<ReorderRequestCreateWithoutRequestedByInput, ReorderRequestUncheckedCreateWithoutRequestedByInput> | ReorderRequestCreateWithoutRequestedByInput[] | ReorderRequestUncheckedCreateWithoutRequestedByInput[]
    connectOrCreate?: ReorderRequestCreateOrConnectWithoutRequestedByInput | ReorderRequestCreateOrConnectWithoutRequestedByInput[]
    upsert?: ReorderRequestUpsertWithWhereUniqueWithoutRequestedByInput | ReorderRequestUpsertWithWhereUniqueWithoutRequestedByInput[]
    createMany?: ReorderRequestCreateManyRequestedByInputEnvelope
    set?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    disconnect?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    delete?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    connect?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    update?: ReorderRequestUpdateWithWhereUniqueWithoutRequestedByInput | ReorderRequestUpdateWithWhereUniqueWithoutRequestedByInput[]
    updateMany?: ReorderRequestUpdateManyWithWhereWithoutRequestedByInput | ReorderRequestUpdateManyWithWhereWithoutRequestedByInput[]
    deleteMany?: ReorderRequestScalarWhereInput | ReorderRequestScalarWhereInput[]
  }

  export type ReorderRequestUpdateManyWithoutResolvedByNestedInput = {
    create?: XOR<ReorderRequestCreateWithoutResolvedByInput, ReorderRequestUncheckedCreateWithoutResolvedByInput> | ReorderRequestCreateWithoutResolvedByInput[] | ReorderRequestUncheckedCreateWithoutResolvedByInput[]
    connectOrCreate?: ReorderRequestCreateOrConnectWithoutResolvedByInput | ReorderRequestCreateOrConnectWithoutResolvedByInput[]
    upsert?: ReorderRequestUpsertWithWhereUniqueWithoutResolvedByInput | ReorderRequestUpsertWithWhereUniqueWithoutResolvedByInput[]
    createMany?: ReorderRequestCreateManyResolvedByInputEnvelope
    set?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    disconnect?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    delete?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    connect?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    update?: ReorderRequestUpdateWithWhereUniqueWithoutResolvedByInput | ReorderRequestUpdateWithWhereUniqueWithoutResolvedByInput[]
    updateMany?: ReorderRequestUpdateManyWithWhereWithoutResolvedByInput | ReorderRequestUpdateManyWithWhereWithoutResolvedByInput[]
    deleteMany?: ReorderRequestScalarWhereInput | ReorderRequestScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type HelpRequestUpdateManyWithoutRequestedByNestedInput = {
    create?: XOR<HelpRequestCreateWithoutRequestedByInput, HelpRequestUncheckedCreateWithoutRequestedByInput> | HelpRequestCreateWithoutRequestedByInput[] | HelpRequestUncheckedCreateWithoutRequestedByInput[]
    connectOrCreate?: HelpRequestCreateOrConnectWithoutRequestedByInput | HelpRequestCreateOrConnectWithoutRequestedByInput[]
    upsert?: HelpRequestUpsertWithWhereUniqueWithoutRequestedByInput | HelpRequestUpsertWithWhereUniqueWithoutRequestedByInput[]
    createMany?: HelpRequestCreateManyRequestedByInputEnvelope
    set?: HelpRequestWhereUniqueInput | HelpRequestWhereUniqueInput[]
    disconnect?: HelpRequestWhereUniqueInput | HelpRequestWhereUniqueInput[]
    delete?: HelpRequestWhereUniqueInput | HelpRequestWhereUniqueInput[]
    connect?: HelpRequestWhereUniqueInput | HelpRequestWhereUniqueInput[]
    update?: HelpRequestUpdateWithWhereUniqueWithoutRequestedByInput | HelpRequestUpdateWithWhereUniqueWithoutRequestedByInput[]
    updateMany?: HelpRequestUpdateManyWithWhereWithoutRequestedByInput | HelpRequestUpdateManyWithWhereWithoutRequestedByInput[]
    deleteMany?: HelpRequestScalarWhereInput | HelpRequestScalarWhereInput[]
  }

  export type HelpRequestResponseUpdateManyWithoutResponderNestedInput = {
    create?: XOR<HelpRequestResponseCreateWithoutResponderInput, HelpRequestResponseUncheckedCreateWithoutResponderInput> | HelpRequestResponseCreateWithoutResponderInput[] | HelpRequestResponseUncheckedCreateWithoutResponderInput[]
    connectOrCreate?: HelpRequestResponseCreateOrConnectWithoutResponderInput | HelpRequestResponseCreateOrConnectWithoutResponderInput[]
    upsert?: HelpRequestResponseUpsertWithWhereUniqueWithoutResponderInput | HelpRequestResponseUpsertWithWhereUniqueWithoutResponderInput[]
    createMany?: HelpRequestResponseCreateManyResponderInputEnvelope
    set?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
    disconnect?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
    delete?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
    connect?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
    update?: HelpRequestResponseUpdateWithWhereUniqueWithoutResponderInput | HelpRequestResponseUpdateWithWhereUniqueWithoutResponderInput[]
    updateMany?: HelpRequestResponseUpdateManyWithWhereWithoutResponderInput | HelpRequestResponseUpdateManyWithWhereWithoutResponderInput[]
    deleteMany?: HelpRequestResponseScalarWhereInput | HelpRequestResponseScalarWhereInput[]
  }

  export type CheckpointUpdateManyWithoutUserNestedInput = {
    create?: XOR<CheckpointCreateWithoutUserInput, CheckpointUncheckedCreateWithoutUserInput> | CheckpointCreateWithoutUserInput[] | CheckpointUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CheckpointCreateOrConnectWithoutUserInput | CheckpointCreateOrConnectWithoutUserInput[]
    upsert?: CheckpointUpsertWithWhereUniqueWithoutUserInput | CheckpointUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CheckpointCreateManyUserInputEnvelope
    set?: CheckpointWhereUniqueInput | CheckpointWhereUniqueInput[]
    disconnect?: CheckpointWhereUniqueInput | CheckpointWhereUniqueInput[]
    delete?: CheckpointWhereUniqueInput | CheckpointWhereUniqueInput[]
    connect?: CheckpointWhereUniqueInput | CheckpointWhereUniqueInput[]
    update?: CheckpointUpdateWithWhereUniqueWithoutUserInput | CheckpointUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CheckpointUpdateManyWithWhereWithoutUserInput | CheckpointUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CheckpointScalarWhereInput | CheckpointScalarWhereInput[]
  }

  export type TicketUncheckedUpdateManyWithoutOpenedByNestedInput = {
    create?: XOR<TicketCreateWithoutOpenedByInput, TicketUncheckedCreateWithoutOpenedByInput> | TicketCreateWithoutOpenedByInput[] | TicketUncheckedCreateWithoutOpenedByInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutOpenedByInput | TicketCreateOrConnectWithoutOpenedByInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutOpenedByInput | TicketUpsertWithWhereUniqueWithoutOpenedByInput[]
    createMany?: TicketCreateManyOpenedByInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutOpenedByInput | TicketUpdateWithWhereUniqueWithoutOpenedByInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutOpenedByInput | TicketUpdateManyWithWhereWithoutOpenedByInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type TicketUncheckedUpdateManyWithoutAssignedToNestedInput = {
    create?: XOR<TicketCreateWithoutAssignedToInput, TicketUncheckedCreateWithoutAssignedToInput> | TicketCreateWithoutAssignedToInput[] | TicketUncheckedCreateWithoutAssignedToInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutAssignedToInput | TicketCreateOrConnectWithoutAssignedToInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutAssignedToInput | TicketUpsertWithWhereUniqueWithoutAssignedToInput[]
    createMany?: TicketCreateManyAssignedToInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutAssignedToInput | TicketUpdateWithWhereUniqueWithoutAssignedToInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutAssignedToInput | TicketUpdateManyWithWhereWithoutAssignedToInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type TicketEventUncheckedUpdateManyWithoutActorNestedInput = {
    create?: XOR<TicketEventCreateWithoutActorInput, TicketEventUncheckedCreateWithoutActorInput> | TicketEventCreateWithoutActorInput[] | TicketEventUncheckedCreateWithoutActorInput[]
    connectOrCreate?: TicketEventCreateOrConnectWithoutActorInput | TicketEventCreateOrConnectWithoutActorInput[]
    upsert?: TicketEventUpsertWithWhereUniqueWithoutActorInput | TicketEventUpsertWithWhereUniqueWithoutActorInput[]
    createMany?: TicketEventCreateManyActorInputEnvelope
    set?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
    disconnect?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
    delete?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
    connect?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
    update?: TicketEventUpdateWithWhereUniqueWithoutActorInput | TicketEventUpdateWithWhereUniqueWithoutActorInput[]
    updateMany?: TicketEventUpdateManyWithWhereWithoutActorInput | TicketEventUpdateManyWithWhereWithoutActorInput[]
    deleteMany?: TicketEventScalarWhereInput | TicketEventScalarWhereInput[]
  }

  export type ReorderRequestUncheckedUpdateManyWithoutRequestedByNestedInput = {
    create?: XOR<ReorderRequestCreateWithoutRequestedByInput, ReorderRequestUncheckedCreateWithoutRequestedByInput> | ReorderRequestCreateWithoutRequestedByInput[] | ReorderRequestUncheckedCreateWithoutRequestedByInput[]
    connectOrCreate?: ReorderRequestCreateOrConnectWithoutRequestedByInput | ReorderRequestCreateOrConnectWithoutRequestedByInput[]
    upsert?: ReorderRequestUpsertWithWhereUniqueWithoutRequestedByInput | ReorderRequestUpsertWithWhereUniqueWithoutRequestedByInput[]
    createMany?: ReorderRequestCreateManyRequestedByInputEnvelope
    set?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    disconnect?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    delete?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    connect?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    update?: ReorderRequestUpdateWithWhereUniqueWithoutRequestedByInput | ReorderRequestUpdateWithWhereUniqueWithoutRequestedByInput[]
    updateMany?: ReorderRequestUpdateManyWithWhereWithoutRequestedByInput | ReorderRequestUpdateManyWithWhereWithoutRequestedByInput[]
    deleteMany?: ReorderRequestScalarWhereInput | ReorderRequestScalarWhereInput[]
  }

  export type ReorderRequestUncheckedUpdateManyWithoutResolvedByNestedInput = {
    create?: XOR<ReorderRequestCreateWithoutResolvedByInput, ReorderRequestUncheckedCreateWithoutResolvedByInput> | ReorderRequestCreateWithoutResolvedByInput[] | ReorderRequestUncheckedCreateWithoutResolvedByInput[]
    connectOrCreate?: ReorderRequestCreateOrConnectWithoutResolvedByInput | ReorderRequestCreateOrConnectWithoutResolvedByInput[]
    upsert?: ReorderRequestUpsertWithWhereUniqueWithoutResolvedByInput | ReorderRequestUpsertWithWhereUniqueWithoutResolvedByInput[]
    createMany?: ReorderRequestCreateManyResolvedByInputEnvelope
    set?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    disconnect?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    delete?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    connect?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    update?: ReorderRequestUpdateWithWhereUniqueWithoutResolvedByInput | ReorderRequestUpdateWithWhereUniqueWithoutResolvedByInput[]
    updateMany?: ReorderRequestUpdateManyWithWhereWithoutResolvedByInput | ReorderRequestUpdateManyWithWhereWithoutResolvedByInput[]
    deleteMany?: ReorderRequestScalarWhereInput | ReorderRequestScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type HelpRequestUncheckedUpdateManyWithoutRequestedByNestedInput = {
    create?: XOR<HelpRequestCreateWithoutRequestedByInput, HelpRequestUncheckedCreateWithoutRequestedByInput> | HelpRequestCreateWithoutRequestedByInput[] | HelpRequestUncheckedCreateWithoutRequestedByInput[]
    connectOrCreate?: HelpRequestCreateOrConnectWithoutRequestedByInput | HelpRequestCreateOrConnectWithoutRequestedByInput[]
    upsert?: HelpRequestUpsertWithWhereUniqueWithoutRequestedByInput | HelpRequestUpsertWithWhereUniqueWithoutRequestedByInput[]
    createMany?: HelpRequestCreateManyRequestedByInputEnvelope
    set?: HelpRequestWhereUniqueInput | HelpRequestWhereUniqueInput[]
    disconnect?: HelpRequestWhereUniqueInput | HelpRequestWhereUniqueInput[]
    delete?: HelpRequestWhereUniqueInput | HelpRequestWhereUniqueInput[]
    connect?: HelpRequestWhereUniqueInput | HelpRequestWhereUniqueInput[]
    update?: HelpRequestUpdateWithWhereUniqueWithoutRequestedByInput | HelpRequestUpdateWithWhereUniqueWithoutRequestedByInput[]
    updateMany?: HelpRequestUpdateManyWithWhereWithoutRequestedByInput | HelpRequestUpdateManyWithWhereWithoutRequestedByInput[]
    deleteMany?: HelpRequestScalarWhereInput | HelpRequestScalarWhereInput[]
  }

  export type HelpRequestResponseUncheckedUpdateManyWithoutResponderNestedInput = {
    create?: XOR<HelpRequestResponseCreateWithoutResponderInput, HelpRequestResponseUncheckedCreateWithoutResponderInput> | HelpRequestResponseCreateWithoutResponderInput[] | HelpRequestResponseUncheckedCreateWithoutResponderInput[]
    connectOrCreate?: HelpRequestResponseCreateOrConnectWithoutResponderInput | HelpRequestResponseCreateOrConnectWithoutResponderInput[]
    upsert?: HelpRequestResponseUpsertWithWhereUniqueWithoutResponderInput | HelpRequestResponseUpsertWithWhereUniqueWithoutResponderInput[]
    createMany?: HelpRequestResponseCreateManyResponderInputEnvelope
    set?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
    disconnect?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
    delete?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
    connect?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
    update?: HelpRequestResponseUpdateWithWhereUniqueWithoutResponderInput | HelpRequestResponseUpdateWithWhereUniqueWithoutResponderInput[]
    updateMany?: HelpRequestResponseUpdateManyWithWhereWithoutResponderInput | HelpRequestResponseUpdateManyWithWhereWithoutResponderInput[]
    deleteMany?: HelpRequestResponseScalarWhereInput | HelpRequestResponseScalarWhereInput[]
  }

  export type CheckpointUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CheckpointCreateWithoutUserInput, CheckpointUncheckedCreateWithoutUserInput> | CheckpointCreateWithoutUserInput[] | CheckpointUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CheckpointCreateOrConnectWithoutUserInput | CheckpointCreateOrConnectWithoutUserInput[]
    upsert?: CheckpointUpsertWithWhereUniqueWithoutUserInput | CheckpointUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CheckpointCreateManyUserInputEnvelope
    set?: CheckpointWhereUniqueInput | CheckpointWhereUniqueInput[]
    disconnect?: CheckpointWhereUniqueInput | CheckpointWhereUniqueInput[]
    delete?: CheckpointWhereUniqueInput | CheckpointWhereUniqueInput[]
    connect?: CheckpointWhereUniqueInput | CheckpointWhereUniqueInput[]
    update?: CheckpointUpdateWithWhereUniqueWithoutUserInput | CheckpointUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CheckpointUpdateManyWithWhereWithoutUserInput | CheckpointUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CheckpointScalarWhereInput | CheckpointScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutOpenedTicketsInput = {
    create?: XOR<UserCreateWithoutOpenedTicketsInput, UserUncheckedCreateWithoutOpenedTicketsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOpenedTicketsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAssignedTicketsInput = {
    create?: XOR<UserCreateWithoutAssignedTicketsInput, UserUncheckedCreateWithoutAssignedTicketsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAssignedTicketsInput
    connect?: UserWhereUniqueInput
  }

  export type BugReportCreateNestedOneWithoutTicketInput = {
    create?: XOR<BugReportCreateWithoutTicketInput, BugReportUncheckedCreateWithoutTicketInput>
    connectOrCreate?: BugReportCreateOrConnectWithoutTicketInput
    connect?: BugReportWhereUniqueInput
  }

  export type TicketEventCreateNestedManyWithoutTicketInput = {
    create?: XOR<TicketEventCreateWithoutTicketInput, TicketEventUncheckedCreateWithoutTicketInput> | TicketEventCreateWithoutTicketInput[] | TicketEventUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketEventCreateOrConnectWithoutTicketInput | TicketEventCreateOrConnectWithoutTicketInput[]
    createMany?: TicketEventCreateManyTicketInputEnvelope
    connect?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
  }

  export type ReorderRequestCreateNestedManyWithoutTicketInput = {
    create?: XOR<ReorderRequestCreateWithoutTicketInput, ReorderRequestUncheckedCreateWithoutTicketInput> | ReorderRequestCreateWithoutTicketInput[] | ReorderRequestUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: ReorderRequestCreateOrConnectWithoutTicketInput | ReorderRequestCreateOrConnectWithoutTicketInput[]
    createMany?: ReorderRequestCreateManyTicketInputEnvelope
    connect?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutTicketInput = {
    create?: XOR<NotificationCreateWithoutTicketInput, NotificationUncheckedCreateWithoutTicketInput> | NotificationCreateWithoutTicketInput[] | NotificationUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTicketInput | NotificationCreateOrConnectWithoutTicketInput[]
    createMany?: NotificationCreateManyTicketInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type BugReportUncheckedCreateNestedOneWithoutTicketInput = {
    create?: XOR<BugReportCreateWithoutTicketInput, BugReportUncheckedCreateWithoutTicketInput>
    connectOrCreate?: BugReportCreateOrConnectWithoutTicketInput
    connect?: BugReportWhereUniqueInput
  }

  export type TicketEventUncheckedCreateNestedManyWithoutTicketInput = {
    create?: XOR<TicketEventCreateWithoutTicketInput, TicketEventUncheckedCreateWithoutTicketInput> | TicketEventCreateWithoutTicketInput[] | TicketEventUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketEventCreateOrConnectWithoutTicketInput | TicketEventCreateOrConnectWithoutTicketInput[]
    createMany?: TicketEventCreateManyTicketInputEnvelope
    connect?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
  }

  export type ReorderRequestUncheckedCreateNestedManyWithoutTicketInput = {
    create?: XOR<ReorderRequestCreateWithoutTicketInput, ReorderRequestUncheckedCreateWithoutTicketInput> | ReorderRequestCreateWithoutTicketInput[] | ReorderRequestUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: ReorderRequestCreateOrConnectWithoutTicketInput | ReorderRequestCreateOrConnectWithoutTicketInput[]
    createMany?: ReorderRequestCreateManyTicketInputEnvelope
    connect?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutTicketInput = {
    create?: XOR<NotificationCreateWithoutTicketInput, NotificationUncheckedCreateWithoutTicketInput> | NotificationCreateWithoutTicketInput[] | NotificationUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTicketInput | NotificationCreateOrConnectWithoutTicketInput[]
    createMany?: NotificationCreateManyTicketInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type EnumTicketTypeFieldUpdateOperationsInput = {
    set?: $Enums.TicketType
  }

  export type EnumSeverityFieldUpdateOperationsInput = {
    set?: $Enums.Severity
  }

  export type EnumTicketStatusFieldUpdateOperationsInput = {
    set?: $Enums.TicketStatus
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutOpenedTicketsNestedInput = {
    create?: XOR<UserCreateWithoutOpenedTicketsInput, UserUncheckedCreateWithoutOpenedTicketsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOpenedTicketsInput
    upsert?: UserUpsertWithoutOpenedTicketsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOpenedTicketsInput, UserUpdateWithoutOpenedTicketsInput>, UserUncheckedUpdateWithoutOpenedTicketsInput>
  }

  export type UserUpdateOneWithoutAssignedTicketsNestedInput = {
    create?: XOR<UserCreateWithoutAssignedTicketsInput, UserUncheckedCreateWithoutAssignedTicketsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAssignedTicketsInput
    upsert?: UserUpsertWithoutAssignedTicketsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAssignedTicketsInput, UserUpdateWithoutAssignedTicketsInput>, UserUncheckedUpdateWithoutAssignedTicketsInput>
  }

  export type BugReportUpdateOneWithoutTicketNestedInput = {
    create?: XOR<BugReportCreateWithoutTicketInput, BugReportUncheckedCreateWithoutTicketInput>
    connectOrCreate?: BugReportCreateOrConnectWithoutTicketInput
    upsert?: BugReportUpsertWithoutTicketInput
    disconnect?: BugReportWhereInput | boolean
    delete?: BugReportWhereInput | boolean
    connect?: BugReportWhereUniqueInput
    update?: XOR<XOR<BugReportUpdateToOneWithWhereWithoutTicketInput, BugReportUpdateWithoutTicketInput>, BugReportUncheckedUpdateWithoutTicketInput>
  }

  export type TicketEventUpdateManyWithoutTicketNestedInput = {
    create?: XOR<TicketEventCreateWithoutTicketInput, TicketEventUncheckedCreateWithoutTicketInput> | TicketEventCreateWithoutTicketInput[] | TicketEventUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketEventCreateOrConnectWithoutTicketInput | TicketEventCreateOrConnectWithoutTicketInput[]
    upsert?: TicketEventUpsertWithWhereUniqueWithoutTicketInput | TicketEventUpsertWithWhereUniqueWithoutTicketInput[]
    createMany?: TicketEventCreateManyTicketInputEnvelope
    set?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
    disconnect?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
    delete?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
    connect?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
    update?: TicketEventUpdateWithWhereUniqueWithoutTicketInput | TicketEventUpdateWithWhereUniqueWithoutTicketInput[]
    updateMany?: TicketEventUpdateManyWithWhereWithoutTicketInput | TicketEventUpdateManyWithWhereWithoutTicketInput[]
    deleteMany?: TicketEventScalarWhereInput | TicketEventScalarWhereInput[]
  }

  export type ReorderRequestUpdateManyWithoutTicketNestedInput = {
    create?: XOR<ReorderRequestCreateWithoutTicketInput, ReorderRequestUncheckedCreateWithoutTicketInput> | ReorderRequestCreateWithoutTicketInput[] | ReorderRequestUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: ReorderRequestCreateOrConnectWithoutTicketInput | ReorderRequestCreateOrConnectWithoutTicketInput[]
    upsert?: ReorderRequestUpsertWithWhereUniqueWithoutTicketInput | ReorderRequestUpsertWithWhereUniqueWithoutTicketInput[]
    createMany?: ReorderRequestCreateManyTicketInputEnvelope
    set?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    disconnect?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    delete?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    connect?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    update?: ReorderRequestUpdateWithWhereUniqueWithoutTicketInput | ReorderRequestUpdateWithWhereUniqueWithoutTicketInput[]
    updateMany?: ReorderRequestUpdateManyWithWhereWithoutTicketInput | ReorderRequestUpdateManyWithWhereWithoutTicketInput[]
    deleteMany?: ReorderRequestScalarWhereInput | ReorderRequestScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutTicketNestedInput = {
    create?: XOR<NotificationCreateWithoutTicketInput, NotificationUncheckedCreateWithoutTicketInput> | NotificationCreateWithoutTicketInput[] | NotificationUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTicketInput | NotificationCreateOrConnectWithoutTicketInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutTicketInput | NotificationUpsertWithWhereUniqueWithoutTicketInput[]
    createMany?: NotificationCreateManyTicketInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutTicketInput | NotificationUpdateWithWhereUniqueWithoutTicketInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutTicketInput | NotificationUpdateManyWithWhereWithoutTicketInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type BugReportUncheckedUpdateOneWithoutTicketNestedInput = {
    create?: XOR<BugReportCreateWithoutTicketInput, BugReportUncheckedCreateWithoutTicketInput>
    connectOrCreate?: BugReportCreateOrConnectWithoutTicketInput
    upsert?: BugReportUpsertWithoutTicketInput
    disconnect?: BugReportWhereInput | boolean
    delete?: BugReportWhereInput | boolean
    connect?: BugReportWhereUniqueInput
    update?: XOR<XOR<BugReportUpdateToOneWithWhereWithoutTicketInput, BugReportUpdateWithoutTicketInput>, BugReportUncheckedUpdateWithoutTicketInput>
  }

  export type TicketEventUncheckedUpdateManyWithoutTicketNestedInput = {
    create?: XOR<TicketEventCreateWithoutTicketInput, TicketEventUncheckedCreateWithoutTicketInput> | TicketEventCreateWithoutTicketInput[] | TicketEventUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketEventCreateOrConnectWithoutTicketInput | TicketEventCreateOrConnectWithoutTicketInput[]
    upsert?: TicketEventUpsertWithWhereUniqueWithoutTicketInput | TicketEventUpsertWithWhereUniqueWithoutTicketInput[]
    createMany?: TicketEventCreateManyTicketInputEnvelope
    set?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
    disconnect?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
    delete?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
    connect?: TicketEventWhereUniqueInput | TicketEventWhereUniqueInput[]
    update?: TicketEventUpdateWithWhereUniqueWithoutTicketInput | TicketEventUpdateWithWhereUniqueWithoutTicketInput[]
    updateMany?: TicketEventUpdateManyWithWhereWithoutTicketInput | TicketEventUpdateManyWithWhereWithoutTicketInput[]
    deleteMany?: TicketEventScalarWhereInput | TicketEventScalarWhereInput[]
  }

  export type ReorderRequestUncheckedUpdateManyWithoutTicketNestedInput = {
    create?: XOR<ReorderRequestCreateWithoutTicketInput, ReorderRequestUncheckedCreateWithoutTicketInput> | ReorderRequestCreateWithoutTicketInput[] | ReorderRequestUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: ReorderRequestCreateOrConnectWithoutTicketInput | ReorderRequestCreateOrConnectWithoutTicketInput[]
    upsert?: ReorderRequestUpsertWithWhereUniqueWithoutTicketInput | ReorderRequestUpsertWithWhereUniqueWithoutTicketInput[]
    createMany?: ReorderRequestCreateManyTicketInputEnvelope
    set?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    disconnect?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    delete?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    connect?: ReorderRequestWhereUniqueInput | ReorderRequestWhereUniqueInput[]
    update?: ReorderRequestUpdateWithWhereUniqueWithoutTicketInput | ReorderRequestUpdateWithWhereUniqueWithoutTicketInput[]
    updateMany?: ReorderRequestUpdateManyWithWhereWithoutTicketInput | ReorderRequestUpdateManyWithWhereWithoutTicketInput[]
    deleteMany?: ReorderRequestScalarWhereInput | ReorderRequestScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutTicketNestedInput = {
    create?: XOR<NotificationCreateWithoutTicketInput, NotificationUncheckedCreateWithoutTicketInput> | NotificationCreateWithoutTicketInput[] | NotificationUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTicketInput | NotificationCreateOrConnectWithoutTicketInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutTicketInput | NotificationUpsertWithWhereUniqueWithoutTicketInput[]
    createMany?: NotificationCreateManyTicketInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutTicketInput | NotificationUpdateWithWhereUniqueWithoutTicketInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutTicketInput | NotificationUpdateManyWithWhereWithoutTicketInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type TicketCreateNestedOneWithoutBugReportInput = {
    create?: XOR<TicketCreateWithoutBugReportInput, TicketUncheckedCreateWithoutBugReportInput>
    connectOrCreate?: TicketCreateOrConnectWithoutBugReportInput
    connect?: TicketWhereUniqueInput
  }

  export type EnumEnvironmentFieldUpdateOperationsInput = {
    set?: $Enums.Environment
  }

  export type TicketUpdateOneRequiredWithoutBugReportNestedInput = {
    create?: XOR<TicketCreateWithoutBugReportInput, TicketUncheckedCreateWithoutBugReportInput>
    connectOrCreate?: TicketCreateOrConnectWithoutBugReportInput
    upsert?: TicketUpsertWithoutBugReportInput
    connect?: TicketWhereUniqueInput
    update?: XOR<XOR<TicketUpdateToOneWithWhereWithoutBugReportInput, TicketUpdateWithoutBugReportInput>, TicketUncheckedUpdateWithoutBugReportInput>
  }

  export type TicketCreateNestedOneWithoutEventsInput = {
    create?: XOR<TicketCreateWithoutEventsInput, TicketUncheckedCreateWithoutEventsInput>
    connectOrCreate?: TicketCreateOrConnectWithoutEventsInput
    connect?: TicketWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutActorEventsInput = {
    create?: XOR<UserCreateWithoutActorEventsInput, UserUncheckedCreateWithoutActorEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutActorEventsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumTicketEventTypeFieldUpdateOperationsInput = {
    set?: $Enums.TicketEventType
  }

  export type TicketUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<TicketCreateWithoutEventsInput, TicketUncheckedCreateWithoutEventsInput>
    connectOrCreate?: TicketCreateOrConnectWithoutEventsInput
    upsert?: TicketUpsertWithoutEventsInput
    connect?: TicketWhereUniqueInput
    update?: XOR<XOR<TicketUpdateToOneWithWhereWithoutEventsInput, TicketUpdateWithoutEventsInput>, TicketUncheckedUpdateWithoutEventsInput>
  }

  export type UserUpdateOneRequiredWithoutActorEventsNestedInput = {
    create?: XOR<UserCreateWithoutActorEventsInput, UserUncheckedCreateWithoutActorEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutActorEventsInput
    upsert?: UserUpsertWithoutActorEventsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutActorEventsInput, UserUpdateWithoutActorEventsInput>, UserUncheckedUpdateWithoutActorEventsInput>
  }

  export type TicketCreateNestedOneWithoutReorderRequestsInput = {
    create?: XOR<TicketCreateWithoutReorderRequestsInput, TicketUncheckedCreateWithoutReorderRequestsInput>
    connectOrCreate?: TicketCreateOrConnectWithoutReorderRequestsInput
    connect?: TicketWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutRequestedReordersInput = {
    create?: XOR<UserCreateWithoutRequestedReordersInput, UserUncheckedCreateWithoutRequestedReordersInput>
    connectOrCreate?: UserCreateOrConnectWithoutRequestedReordersInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutResolvedReordersInput = {
    create?: XOR<UserCreateWithoutResolvedReordersInput, UserUncheckedCreateWithoutResolvedReordersInput>
    connectOrCreate?: UserCreateOrConnectWithoutResolvedReordersInput
    connect?: UserWhereUniqueInput
  }

  export type EnumReorderStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReorderStatus
  }

  export type TicketUpdateOneRequiredWithoutReorderRequestsNestedInput = {
    create?: XOR<TicketCreateWithoutReorderRequestsInput, TicketUncheckedCreateWithoutReorderRequestsInput>
    connectOrCreate?: TicketCreateOrConnectWithoutReorderRequestsInput
    upsert?: TicketUpsertWithoutReorderRequestsInput
    connect?: TicketWhereUniqueInput
    update?: XOR<XOR<TicketUpdateToOneWithWhereWithoutReorderRequestsInput, TicketUpdateWithoutReorderRequestsInput>, TicketUncheckedUpdateWithoutReorderRequestsInput>
  }

  export type UserUpdateOneRequiredWithoutRequestedReordersNestedInput = {
    create?: XOR<UserCreateWithoutRequestedReordersInput, UserUncheckedCreateWithoutRequestedReordersInput>
    connectOrCreate?: UserCreateOrConnectWithoutRequestedReordersInput
    upsert?: UserUpsertWithoutRequestedReordersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRequestedReordersInput, UserUpdateWithoutRequestedReordersInput>, UserUncheckedUpdateWithoutRequestedReordersInput>
  }

  export type UserUpdateOneWithoutResolvedReordersNestedInput = {
    create?: XOR<UserCreateWithoutResolvedReordersInput, UserUncheckedCreateWithoutResolvedReordersInput>
    connectOrCreate?: UserCreateOrConnectWithoutResolvedReordersInput
    upsert?: UserUpsertWithoutResolvedReordersInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutResolvedReordersInput, UserUpdateWithoutResolvedReordersInput>, UserUncheckedUpdateWithoutResolvedReordersInput>
  }

  export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type TicketCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<TicketCreateWithoutNotificationsInput, TicketUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: TicketCreateOrConnectWithoutNotificationsInput
    connect?: TicketWhereUniqueInput
  }

  export type EnumNotificationTypeFieldUpdateOperationsInput = {
    set?: $Enums.NotificationType
  }

  export type UserUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    upsert?: UserUpsertWithoutNotificationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationsInput, UserUpdateWithoutNotificationsInput>, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type TicketUpdateOneWithoutNotificationsNestedInput = {
    create?: XOR<TicketCreateWithoutNotificationsInput, TicketUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: TicketCreateOrConnectWithoutNotificationsInput
    upsert?: TicketUpsertWithoutNotificationsInput
    disconnect?: TicketWhereInput | boolean
    delete?: TicketWhereInput | boolean
    connect?: TicketWhereUniqueInput
    update?: XOR<XOR<TicketUpdateToOneWithWhereWithoutNotificationsInput, TicketUpdateWithoutNotificationsInput>, TicketUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserCreateNestedOneWithoutRequestedHelpInput = {
    create?: XOR<UserCreateWithoutRequestedHelpInput, UserUncheckedCreateWithoutRequestedHelpInput>
    connectOrCreate?: UserCreateOrConnectWithoutRequestedHelpInput
    connect?: UserWhereUniqueInput
  }

  export type HelpRequestResponseCreateNestedManyWithoutHelpRequestInput = {
    create?: XOR<HelpRequestResponseCreateWithoutHelpRequestInput, HelpRequestResponseUncheckedCreateWithoutHelpRequestInput> | HelpRequestResponseCreateWithoutHelpRequestInput[] | HelpRequestResponseUncheckedCreateWithoutHelpRequestInput[]
    connectOrCreate?: HelpRequestResponseCreateOrConnectWithoutHelpRequestInput | HelpRequestResponseCreateOrConnectWithoutHelpRequestInput[]
    createMany?: HelpRequestResponseCreateManyHelpRequestInputEnvelope
    connect?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
  }

  export type HelpRequestResponseUncheckedCreateNestedManyWithoutHelpRequestInput = {
    create?: XOR<HelpRequestResponseCreateWithoutHelpRequestInput, HelpRequestResponseUncheckedCreateWithoutHelpRequestInput> | HelpRequestResponseCreateWithoutHelpRequestInput[] | HelpRequestResponseUncheckedCreateWithoutHelpRequestInput[]
    connectOrCreate?: HelpRequestResponseCreateOrConnectWithoutHelpRequestInput | HelpRequestResponseCreateOrConnectWithoutHelpRequestInput[]
    createMany?: HelpRequestResponseCreateManyHelpRequestInputEnvelope
    connect?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutRequestedHelpNestedInput = {
    create?: XOR<UserCreateWithoutRequestedHelpInput, UserUncheckedCreateWithoutRequestedHelpInput>
    connectOrCreate?: UserCreateOrConnectWithoutRequestedHelpInput
    upsert?: UserUpsertWithoutRequestedHelpInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRequestedHelpInput, UserUpdateWithoutRequestedHelpInput>, UserUncheckedUpdateWithoutRequestedHelpInput>
  }

  export type HelpRequestResponseUpdateManyWithoutHelpRequestNestedInput = {
    create?: XOR<HelpRequestResponseCreateWithoutHelpRequestInput, HelpRequestResponseUncheckedCreateWithoutHelpRequestInput> | HelpRequestResponseCreateWithoutHelpRequestInput[] | HelpRequestResponseUncheckedCreateWithoutHelpRequestInput[]
    connectOrCreate?: HelpRequestResponseCreateOrConnectWithoutHelpRequestInput | HelpRequestResponseCreateOrConnectWithoutHelpRequestInput[]
    upsert?: HelpRequestResponseUpsertWithWhereUniqueWithoutHelpRequestInput | HelpRequestResponseUpsertWithWhereUniqueWithoutHelpRequestInput[]
    createMany?: HelpRequestResponseCreateManyHelpRequestInputEnvelope
    set?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
    disconnect?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
    delete?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
    connect?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
    update?: HelpRequestResponseUpdateWithWhereUniqueWithoutHelpRequestInput | HelpRequestResponseUpdateWithWhereUniqueWithoutHelpRequestInput[]
    updateMany?: HelpRequestResponseUpdateManyWithWhereWithoutHelpRequestInput | HelpRequestResponseUpdateManyWithWhereWithoutHelpRequestInput[]
    deleteMany?: HelpRequestResponseScalarWhereInput | HelpRequestResponseScalarWhereInput[]
  }

  export type HelpRequestResponseUncheckedUpdateManyWithoutHelpRequestNestedInput = {
    create?: XOR<HelpRequestResponseCreateWithoutHelpRequestInput, HelpRequestResponseUncheckedCreateWithoutHelpRequestInput> | HelpRequestResponseCreateWithoutHelpRequestInput[] | HelpRequestResponseUncheckedCreateWithoutHelpRequestInput[]
    connectOrCreate?: HelpRequestResponseCreateOrConnectWithoutHelpRequestInput | HelpRequestResponseCreateOrConnectWithoutHelpRequestInput[]
    upsert?: HelpRequestResponseUpsertWithWhereUniqueWithoutHelpRequestInput | HelpRequestResponseUpsertWithWhereUniqueWithoutHelpRequestInput[]
    createMany?: HelpRequestResponseCreateManyHelpRequestInputEnvelope
    set?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
    disconnect?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
    delete?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
    connect?: HelpRequestResponseWhereUniqueInput | HelpRequestResponseWhereUniqueInput[]
    update?: HelpRequestResponseUpdateWithWhereUniqueWithoutHelpRequestInput | HelpRequestResponseUpdateWithWhereUniqueWithoutHelpRequestInput[]
    updateMany?: HelpRequestResponseUpdateManyWithWhereWithoutHelpRequestInput | HelpRequestResponseUpdateManyWithWhereWithoutHelpRequestInput[]
    deleteMany?: HelpRequestResponseScalarWhereInput | HelpRequestResponseScalarWhereInput[]
  }

  export type HelpRequestCreateNestedOneWithoutResponsesInput = {
    create?: XOR<HelpRequestCreateWithoutResponsesInput, HelpRequestUncheckedCreateWithoutResponsesInput>
    connectOrCreate?: HelpRequestCreateOrConnectWithoutResponsesInput
    connect?: HelpRequestWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutHelpResponsesInput = {
    create?: XOR<UserCreateWithoutHelpResponsesInput, UserUncheckedCreateWithoutHelpResponsesInput>
    connectOrCreate?: UserCreateOrConnectWithoutHelpResponsesInput
    connect?: UserWhereUniqueInput
  }

  export type HelpRequestUpdateOneRequiredWithoutResponsesNestedInput = {
    create?: XOR<HelpRequestCreateWithoutResponsesInput, HelpRequestUncheckedCreateWithoutResponsesInput>
    connectOrCreate?: HelpRequestCreateOrConnectWithoutResponsesInput
    upsert?: HelpRequestUpsertWithoutResponsesInput
    connect?: HelpRequestWhereUniqueInput
    update?: XOR<XOR<HelpRequestUpdateToOneWithWhereWithoutResponsesInput, HelpRequestUpdateWithoutResponsesInput>, HelpRequestUncheckedUpdateWithoutResponsesInput>
  }

  export type UserUpdateOneRequiredWithoutHelpResponsesNestedInput = {
    create?: XOR<UserCreateWithoutHelpResponsesInput, UserUncheckedCreateWithoutHelpResponsesInput>
    connectOrCreate?: UserCreateOrConnectWithoutHelpResponsesInput
    upsert?: UserUpsertWithoutHelpResponsesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutHelpResponsesInput, UserUpdateWithoutHelpResponsesInput>, UserUncheckedUpdateWithoutHelpResponsesInput>
  }

  export type UserCreateNestedOneWithoutCheckpointsInput = {
    create?: XOR<UserCreateWithoutCheckpointsInput, UserUncheckedCreateWithoutCheckpointsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCheckpointsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutCheckpointsNestedInput = {
    create?: XOR<UserCreateWithoutCheckpointsInput, UserUncheckedCreateWithoutCheckpointsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCheckpointsInput
    upsert?: UserUpsertWithoutCheckpointsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCheckpointsInput, UserUpdateWithoutCheckpointsInput>, UserUncheckedUpdateWithoutCheckpointsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumDevStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.DevStatus | EnumDevStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.DevStatus[] | null
    notIn?: $Enums.DevStatus[] | null
    not?: NestedEnumDevStatusNullableFilter<$PrismaModel> | $Enums.DevStatus | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
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

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
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
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumDevStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DevStatus | EnumDevStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.DevStatus[] | null
    notIn?: $Enums.DevStatus[] | null
    not?: NestedEnumDevStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.DevStatus | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumDevStatusNullableFilter<$PrismaModel>
    _max?: NestedEnumDevStatusNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumTicketTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketType | EnumTicketTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TicketType[]
    notIn?: $Enums.TicketType[]
    not?: NestedEnumTicketTypeFilter<$PrismaModel> | $Enums.TicketType
  }

  export type NestedEnumSeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.Severity | EnumSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.Severity[]
    notIn?: $Enums.Severity[]
    not?: NestedEnumSeverityFilter<$PrismaModel> | $Enums.Severity
  }

  export type NestedEnumTicketStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[]
    notIn?: $Enums.TicketStatus[]
    not?: NestedEnumTicketStatusFilter<$PrismaModel> | $Enums.TicketStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumTicketTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketType | EnumTicketTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TicketType[]
    notIn?: $Enums.TicketType[]
    not?: NestedEnumTicketTypeWithAggregatesFilter<$PrismaModel> | $Enums.TicketType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTicketTypeFilter<$PrismaModel>
    _max?: NestedEnumTicketTypeFilter<$PrismaModel>
  }

  export type NestedEnumSeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Severity | EnumSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.Severity[]
    notIn?: $Enums.Severity[]
    not?: NestedEnumSeverityWithAggregatesFilter<$PrismaModel> | $Enums.Severity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSeverityFilter<$PrismaModel>
    _max?: NestedEnumSeverityFilter<$PrismaModel>
  }

  export type NestedEnumTicketStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[]
    notIn?: $Enums.TicketStatus[]
    not?: NestedEnumTicketStatusWithAggregatesFilter<$PrismaModel> | $Enums.TicketStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTicketStatusFilter<$PrismaModel>
    _max?: NestedEnumTicketStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
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

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumEnvironmentFilter<$PrismaModel = never> = {
    equals?: $Enums.Environment | EnumEnvironmentFieldRefInput<$PrismaModel>
    in?: $Enums.Environment[]
    notIn?: $Enums.Environment[]
    not?: NestedEnumEnvironmentFilter<$PrismaModel> | $Enums.Environment
  }

  export type NestedEnumEnvironmentWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Environment | EnumEnvironmentFieldRefInput<$PrismaModel>
    in?: $Enums.Environment[]
    notIn?: $Enums.Environment[]
    not?: NestedEnumEnvironmentWithAggregatesFilter<$PrismaModel> | $Enums.Environment
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEnvironmentFilter<$PrismaModel>
    _max?: NestedEnumEnvironmentFilter<$PrismaModel>
  }

  export type NestedEnumTicketEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketEventType | EnumTicketEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TicketEventType[]
    notIn?: $Enums.TicketEventType[]
    not?: NestedEnumTicketEventTypeFilter<$PrismaModel> | $Enums.TicketEventType
  }

  export type NestedEnumTicketEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketEventType | EnumTicketEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TicketEventType[]
    notIn?: $Enums.TicketEventType[]
    not?: NestedEnumTicketEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.TicketEventType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTicketEventTypeFilter<$PrismaModel>
    _max?: NestedEnumTicketEventTypeFilter<$PrismaModel>
  }

  export type NestedEnumReorderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReorderStatus | EnumReorderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReorderStatus[]
    notIn?: $Enums.ReorderStatus[]
    not?: NestedEnumReorderStatusFilter<$PrismaModel> | $Enums.ReorderStatus
  }

  export type NestedEnumReorderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReorderStatus | EnumReorderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReorderStatus[]
    notIn?: $Enums.ReorderStatus[]
    not?: NestedEnumReorderStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReorderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReorderStatusFilter<$PrismaModel>
    _max?: NestedEnumReorderStatusFilter<$PrismaModel>
  }

  export type NestedEnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[]
    notIn?: $Enums.NotificationType[]
    not?: NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType
  }

  export type NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[]
    notIn?: $Enums.NotificationType[]
    not?: NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>
  }

  export type TicketCreateWithoutOpenedByInput = {
    id?: string
    publicId: string
    title: string
    description: string
    type: $Enums.TicketType
    severity: $Enums.Severity
    status?: $Enums.TicketStatus
    deadline: Date | string
    priorityOrder: number
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
    assignedTo?: UserCreateNestedOneWithoutAssignedTicketsInput
    bugReport?: BugReportCreateNestedOneWithoutTicketInput
    events?: TicketEventCreateNestedManyWithoutTicketInput
    reorderRequests?: ReorderRequestCreateNestedManyWithoutTicketInput
    notifications?: NotificationCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateWithoutOpenedByInput = {
    id?: string
    publicId: string
    title: string
    description: string
    type: $Enums.TicketType
    severity: $Enums.Severity
    status?: $Enums.TicketStatus
    deadline: Date | string
    priorityOrder: number
    assignedToId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
    bugReport?: BugReportUncheckedCreateNestedOneWithoutTicketInput
    events?: TicketEventUncheckedCreateNestedManyWithoutTicketInput
    reorderRequests?: ReorderRequestUncheckedCreateNestedManyWithoutTicketInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketCreateOrConnectWithoutOpenedByInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutOpenedByInput, TicketUncheckedCreateWithoutOpenedByInput>
  }

  export type TicketCreateManyOpenedByInputEnvelope = {
    data: TicketCreateManyOpenedByInput | TicketCreateManyOpenedByInput[]
  }

  export type TicketCreateWithoutAssignedToInput = {
    id?: string
    publicId: string
    title: string
    description: string
    type: $Enums.TicketType
    severity: $Enums.Severity
    status?: $Enums.TicketStatus
    deadline: Date | string
    priorityOrder: number
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
    openedBy: UserCreateNestedOneWithoutOpenedTicketsInput
    bugReport?: BugReportCreateNestedOneWithoutTicketInput
    events?: TicketEventCreateNestedManyWithoutTicketInput
    reorderRequests?: ReorderRequestCreateNestedManyWithoutTicketInput
    notifications?: NotificationCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateWithoutAssignedToInput = {
    id?: string
    publicId: string
    title: string
    description: string
    type: $Enums.TicketType
    severity: $Enums.Severity
    status?: $Enums.TicketStatus
    deadline: Date | string
    priorityOrder: number
    openedById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
    bugReport?: BugReportUncheckedCreateNestedOneWithoutTicketInput
    events?: TicketEventUncheckedCreateNestedManyWithoutTicketInput
    reorderRequests?: ReorderRequestUncheckedCreateNestedManyWithoutTicketInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketCreateOrConnectWithoutAssignedToInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutAssignedToInput, TicketUncheckedCreateWithoutAssignedToInput>
  }

  export type TicketCreateManyAssignedToInputEnvelope = {
    data: TicketCreateManyAssignedToInput | TicketCreateManyAssignedToInput[]
  }

  export type TicketEventCreateWithoutActorInput = {
    id?: string
    eventType: $Enums.TicketEventType
    metadata?: string
    createdAt?: Date | string
    ticket: TicketCreateNestedOneWithoutEventsInput
  }

  export type TicketEventUncheckedCreateWithoutActorInput = {
    id?: string
    ticketId: string
    eventType: $Enums.TicketEventType
    metadata?: string
    createdAt?: Date | string
  }

  export type TicketEventCreateOrConnectWithoutActorInput = {
    where: TicketEventWhereUniqueInput
    create: XOR<TicketEventCreateWithoutActorInput, TicketEventUncheckedCreateWithoutActorInput>
  }

  export type TicketEventCreateManyActorInputEnvelope = {
    data: TicketEventCreateManyActorInput | TicketEventCreateManyActorInput[]
  }

  export type ReorderRequestCreateWithoutRequestedByInput = {
    id?: string
    requestedPosition: number
    reason?: string | null
    status?: $Enums.ReorderStatus
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    ticket: TicketCreateNestedOneWithoutReorderRequestsInput
    resolvedBy?: UserCreateNestedOneWithoutResolvedReordersInput
  }

  export type ReorderRequestUncheckedCreateWithoutRequestedByInput = {
    id?: string
    ticketId: string
    requestedPosition: number
    reason?: string | null
    status?: $Enums.ReorderStatus
    resolvedById?: string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ReorderRequestCreateOrConnectWithoutRequestedByInput = {
    where: ReorderRequestWhereUniqueInput
    create: XOR<ReorderRequestCreateWithoutRequestedByInput, ReorderRequestUncheckedCreateWithoutRequestedByInput>
  }

  export type ReorderRequestCreateManyRequestedByInputEnvelope = {
    data: ReorderRequestCreateManyRequestedByInput | ReorderRequestCreateManyRequestedByInput[]
  }

  export type ReorderRequestCreateWithoutResolvedByInput = {
    id?: string
    requestedPosition: number
    reason?: string | null
    status?: $Enums.ReorderStatus
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    ticket: TicketCreateNestedOneWithoutReorderRequestsInput
    requestedBy: UserCreateNestedOneWithoutRequestedReordersInput
  }

  export type ReorderRequestUncheckedCreateWithoutResolvedByInput = {
    id?: string
    ticketId: string
    requestedById: string
    requestedPosition: number
    reason?: string | null
    status?: $Enums.ReorderStatus
    resolvedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ReorderRequestCreateOrConnectWithoutResolvedByInput = {
    where: ReorderRequestWhereUniqueInput
    create: XOR<ReorderRequestCreateWithoutResolvedByInput, ReorderRequestUncheckedCreateWithoutResolvedByInput>
  }

  export type ReorderRequestCreateManyResolvedByInputEnvelope = {
    data: ReorderRequestCreateManyResolvedByInput | ReorderRequestCreateManyResolvedByInput[]
  }

  export type NotificationCreateWithoutUserInput = {
    id?: string
    type: $Enums.NotificationType
    title: string
    body: string
    isRead?: boolean
    requiresAck?: boolean
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
    ticket?: TicketCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: string
    type: $Enums.NotificationType
    title: string
    body: string
    ticketId?: string | null
    isRead?: boolean
    requiresAck?: boolean
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
  }

  export type HelpRequestCreateWithoutRequestedByInput = {
    id?: string
    contextMessage: string
    createdAt?: Date | string
    responses?: HelpRequestResponseCreateNestedManyWithoutHelpRequestInput
  }

  export type HelpRequestUncheckedCreateWithoutRequestedByInput = {
    id?: string
    contextMessage: string
    createdAt?: Date | string
    responses?: HelpRequestResponseUncheckedCreateNestedManyWithoutHelpRequestInput
  }

  export type HelpRequestCreateOrConnectWithoutRequestedByInput = {
    where: HelpRequestWhereUniqueInput
    create: XOR<HelpRequestCreateWithoutRequestedByInput, HelpRequestUncheckedCreateWithoutRequestedByInput>
  }

  export type HelpRequestCreateManyRequestedByInputEnvelope = {
    data: HelpRequestCreateManyRequestedByInput | HelpRequestCreateManyRequestedByInput[]
  }

  export type HelpRequestResponseCreateWithoutResponderInput = {
    id?: string
    respondedAt?: Date | string
    helpRequest: HelpRequestCreateNestedOneWithoutResponsesInput
  }

  export type HelpRequestResponseUncheckedCreateWithoutResponderInput = {
    id?: string
    helpRequestId: string
    respondedAt?: Date | string
  }

  export type HelpRequestResponseCreateOrConnectWithoutResponderInput = {
    where: HelpRequestResponseWhereUniqueInput
    create: XOR<HelpRequestResponseCreateWithoutResponderInput, HelpRequestResponseUncheckedCreateWithoutResponderInput>
  }

  export type HelpRequestResponseCreateManyResponderInputEnvelope = {
    data: HelpRequestResponseCreateManyResponderInput | HelpRequestResponseCreateManyResponderInput[]
  }

  export type CheckpointCreateWithoutUserInput = {
    id?: string
    currentTask: string
    isBlocked: boolean
    notes?: string | null
    createdAt?: Date | string
  }

  export type CheckpointUncheckedCreateWithoutUserInput = {
    id?: string
    currentTask: string
    isBlocked: boolean
    notes?: string | null
    createdAt?: Date | string
  }

  export type CheckpointCreateOrConnectWithoutUserInput = {
    where: CheckpointWhereUniqueInput
    create: XOR<CheckpointCreateWithoutUserInput, CheckpointUncheckedCreateWithoutUserInput>
  }

  export type CheckpointCreateManyUserInputEnvelope = {
    data: CheckpointCreateManyUserInput | CheckpointCreateManyUserInput[]
  }

  export type TicketUpsertWithWhereUniqueWithoutOpenedByInput = {
    where: TicketWhereUniqueInput
    update: XOR<TicketUpdateWithoutOpenedByInput, TicketUncheckedUpdateWithoutOpenedByInput>
    create: XOR<TicketCreateWithoutOpenedByInput, TicketUncheckedCreateWithoutOpenedByInput>
  }

  export type TicketUpdateWithWhereUniqueWithoutOpenedByInput = {
    where: TicketWhereUniqueInput
    data: XOR<TicketUpdateWithoutOpenedByInput, TicketUncheckedUpdateWithoutOpenedByInput>
  }

  export type TicketUpdateManyWithWhereWithoutOpenedByInput = {
    where: TicketScalarWhereInput
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyWithoutOpenedByInput>
  }

  export type TicketScalarWhereInput = {
    AND?: TicketScalarWhereInput | TicketScalarWhereInput[]
    OR?: TicketScalarWhereInput[]
    NOT?: TicketScalarWhereInput | TicketScalarWhereInput[]
    id?: StringFilter<"Ticket"> | string
    publicId?: StringFilter<"Ticket"> | string
    title?: StringFilter<"Ticket"> | string
    description?: StringFilter<"Ticket"> | string
    type?: EnumTicketTypeFilter<"Ticket"> | $Enums.TicketType
    severity?: EnumSeverityFilter<"Ticket"> | $Enums.Severity
    status?: EnumTicketStatusFilter<"Ticket"> | $Enums.TicketStatus
    deadline?: DateTimeFilter<"Ticket"> | Date | string
    priorityOrder?: IntFilter<"Ticket"> | number
    openedById?: StringFilter<"Ticket"> | string
    assignedToId?: StringNullableFilter<"Ticket"> | string | null
    createdAt?: DateTimeFilter<"Ticket"> | Date | string
    updatedAt?: DateTimeFilter<"Ticket"> | Date | string
    resolvedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
  }

  export type TicketUpsertWithWhereUniqueWithoutAssignedToInput = {
    where: TicketWhereUniqueInput
    update: XOR<TicketUpdateWithoutAssignedToInput, TicketUncheckedUpdateWithoutAssignedToInput>
    create: XOR<TicketCreateWithoutAssignedToInput, TicketUncheckedCreateWithoutAssignedToInput>
  }

  export type TicketUpdateWithWhereUniqueWithoutAssignedToInput = {
    where: TicketWhereUniqueInput
    data: XOR<TicketUpdateWithoutAssignedToInput, TicketUncheckedUpdateWithoutAssignedToInput>
  }

  export type TicketUpdateManyWithWhereWithoutAssignedToInput = {
    where: TicketScalarWhereInput
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyWithoutAssignedToInput>
  }

  export type TicketEventUpsertWithWhereUniqueWithoutActorInput = {
    where: TicketEventWhereUniqueInput
    update: XOR<TicketEventUpdateWithoutActorInput, TicketEventUncheckedUpdateWithoutActorInput>
    create: XOR<TicketEventCreateWithoutActorInput, TicketEventUncheckedCreateWithoutActorInput>
  }

  export type TicketEventUpdateWithWhereUniqueWithoutActorInput = {
    where: TicketEventWhereUniqueInput
    data: XOR<TicketEventUpdateWithoutActorInput, TicketEventUncheckedUpdateWithoutActorInput>
  }

  export type TicketEventUpdateManyWithWhereWithoutActorInput = {
    where: TicketEventScalarWhereInput
    data: XOR<TicketEventUpdateManyMutationInput, TicketEventUncheckedUpdateManyWithoutActorInput>
  }

  export type TicketEventScalarWhereInput = {
    AND?: TicketEventScalarWhereInput | TicketEventScalarWhereInput[]
    OR?: TicketEventScalarWhereInput[]
    NOT?: TicketEventScalarWhereInput | TicketEventScalarWhereInput[]
    id?: StringFilter<"TicketEvent"> | string
    ticketId?: StringFilter<"TicketEvent"> | string
    eventType?: EnumTicketEventTypeFilter<"TicketEvent"> | $Enums.TicketEventType
    actorId?: StringFilter<"TicketEvent"> | string
    metadata?: StringFilter<"TicketEvent"> | string
    createdAt?: DateTimeFilter<"TicketEvent"> | Date | string
  }

  export type ReorderRequestUpsertWithWhereUniqueWithoutRequestedByInput = {
    where: ReorderRequestWhereUniqueInput
    update: XOR<ReorderRequestUpdateWithoutRequestedByInput, ReorderRequestUncheckedUpdateWithoutRequestedByInput>
    create: XOR<ReorderRequestCreateWithoutRequestedByInput, ReorderRequestUncheckedCreateWithoutRequestedByInput>
  }

  export type ReorderRequestUpdateWithWhereUniqueWithoutRequestedByInput = {
    where: ReorderRequestWhereUniqueInput
    data: XOR<ReorderRequestUpdateWithoutRequestedByInput, ReorderRequestUncheckedUpdateWithoutRequestedByInput>
  }

  export type ReorderRequestUpdateManyWithWhereWithoutRequestedByInput = {
    where: ReorderRequestScalarWhereInput
    data: XOR<ReorderRequestUpdateManyMutationInput, ReorderRequestUncheckedUpdateManyWithoutRequestedByInput>
  }

  export type ReorderRequestScalarWhereInput = {
    AND?: ReorderRequestScalarWhereInput | ReorderRequestScalarWhereInput[]
    OR?: ReorderRequestScalarWhereInput[]
    NOT?: ReorderRequestScalarWhereInput | ReorderRequestScalarWhereInput[]
    id?: StringFilter<"ReorderRequest"> | string
    ticketId?: StringFilter<"ReorderRequest"> | string
    requestedById?: StringFilter<"ReorderRequest"> | string
    requestedPosition?: IntFilter<"ReorderRequest"> | number
    reason?: StringNullableFilter<"ReorderRequest"> | string | null
    status?: EnumReorderStatusFilter<"ReorderRequest"> | $Enums.ReorderStatus
    resolvedById?: StringNullableFilter<"ReorderRequest"> | string | null
    resolvedAt?: DateTimeNullableFilter<"ReorderRequest"> | Date | string | null
    createdAt?: DateTimeFilter<"ReorderRequest"> | Date | string
  }

  export type ReorderRequestUpsertWithWhereUniqueWithoutResolvedByInput = {
    where: ReorderRequestWhereUniqueInput
    update: XOR<ReorderRequestUpdateWithoutResolvedByInput, ReorderRequestUncheckedUpdateWithoutResolvedByInput>
    create: XOR<ReorderRequestCreateWithoutResolvedByInput, ReorderRequestUncheckedCreateWithoutResolvedByInput>
  }

  export type ReorderRequestUpdateWithWhereUniqueWithoutResolvedByInput = {
    where: ReorderRequestWhereUniqueInput
    data: XOR<ReorderRequestUpdateWithoutResolvedByInput, ReorderRequestUncheckedUpdateWithoutResolvedByInput>
  }

  export type ReorderRequestUpdateManyWithWhereWithoutResolvedByInput = {
    where: ReorderRequestScalarWhereInput
    data: XOR<ReorderRequestUpdateManyMutationInput, ReorderRequestUncheckedUpdateManyWithoutResolvedByInput>
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringFilter<"Notification"> | string
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    ticketId?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    requiresAck?: BoolFilter<"Notification"> | boolean
    acknowledgedAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type HelpRequestUpsertWithWhereUniqueWithoutRequestedByInput = {
    where: HelpRequestWhereUniqueInput
    update: XOR<HelpRequestUpdateWithoutRequestedByInput, HelpRequestUncheckedUpdateWithoutRequestedByInput>
    create: XOR<HelpRequestCreateWithoutRequestedByInput, HelpRequestUncheckedCreateWithoutRequestedByInput>
  }

  export type HelpRequestUpdateWithWhereUniqueWithoutRequestedByInput = {
    where: HelpRequestWhereUniqueInput
    data: XOR<HelpRequestUpdateWithoutRequestedByInput, HelpRequestUncheckedUpdateWithoutRequestedByInput>
  }

  export type HelpRequestUpdateManyWithWhereWithoutRequestedByInput = {
    where: HelpRequestScalarWhereInput
    data: XOR<HelpRequestUpdateManyMutationInput, HelpRequestUncheckedUpdateManyWithoutRequestedByInput>
  }

  export type HelpRequestScalarWhereInput = {
    AND?: HelpRequestScalarWhereInput | HelpRequestScalarWhereInput[]
    OR?: HelpRequestScalarWhereInput[]
    NOT?: HelpRequestScalarWhereInput | HelpRequestScalarWhereInput[]
    id?: StringFilter<"HelpRequest"> | string
    requestedById?: StringFilter<"HelpRequest"> | string
    contextMessage?: StringFilter<"HelpRequest"> | string
    createdAt?: DateTimeFilter<"HelpRequest"> | Date | string
  }

  export type HelpRequestResponseUpsertWithWhereUniqueWithoutResponderInput = {
    where: HelpRequestResponseWhereUniqueInput
    update: XOR<HelpRequestResponseUpdateWithoutResponderInput, HelpRequestResponseUncheckedUpdateWithoutResponderInput>
    create: XOR<HelpRequestResponseCreateWithoutResponderInput, HelpRequestResponseUncheckedCreateWithoutResponderInput>
  }

  export type HelpRequestResponseUpdateWithWhereUniqueWithoutResponderInput = {
    where: HelpRequestResponseWhereUniqueInput
    data: XOR<HelpRequestResponseUpdateWithoutResponderInput, HelpRequestResponseUncheckedUpdateWithoutResponderInput>
  }

  export type HelpRequestResponseUpdateManyWithWhereWithoutResponderInput = {
    where: HelpRequestResponseScalarWhereInput
    data: XOR<HelpRequestResponseUpdateManyMutationInput, HelpRequestResponseUncheckedUpdateManyWithoutResponderInput>
  }

  export type HelpRequestResponseScalarWhereInput = {
    AND?: HelpRequestResponseScalarWhereInput | HelpRequestResponseScalarWhereInput[]
    OR?: HelpRequestResponseScalarWhereInput[]
    NOT?: HelpRequestResponseScalarWhereInput | HelpRequestResponseScalarWhereInput[]
    id?: StringFilter<"HelpRequestResponse"> | string
    helpRequestId?: StringFilter<"HelpRequestResponse"> | string
    responderId?: StringFilter<"HelpRequestResponse"> | string
    respondedAt?: DateTimeFilter<"HelpRequestResponse"> | Date | string
  }

  export type CheckpointUpsertWithWhereUniqueWithoutUserInput = {
    where: CheckpointWhereUniqueInput
    update: XOR<CheckpointUpdateWithoutUserInput, CheckpointUncheckedUpdateWithoutUserInput>
    create: XOR<CheckpointCreateWithoutUserInput, CheckpointUncheckedCreateWithoutUserInput>
  }

  export type CheckpointUpdateWithWhereUniqueWithoutUserInput = {
    where: CheckpointWhereUniqueInput
    data: XOR<CheckpointUpdateWithoutUserInput, CheckpointUncheckedUpdateWithoutUserInput>
  }

  export type CheckpointUpdateManyWithWhereWithoutUserInput = {
    where: CheckpointScalarWhereInput
    data: XOR<CheckpointUpdateManyMutationInput, CheckpointUncheckedUpdateManyWithoutUserInput>
  }

  export type CheckpointScalarWhereInput = {
    AND?: CheckpointScalarWhereInput | CheckpointScalarWhereInput[]
    OR?: CheckpointScalarWhereInput[]
    NOT?: CheckpointScalarWhereInput | CheckpointScalarWhereInput[]
    id?: StringFilter<"Checkpoint"> | string
    userId?: StringFilter<"Checkpoint"> | string
    currentTask?: StringFilter<"Checkpoint"> | string
    isBlocked?: BoolFilter<"Checkpoint"> | boolean
    notes?: StringNullableFilter<"Checkpoint"> | string | null
    createdAt?: DateTimeFilter<"Checkpoint"> | Date | string
  }

  export type UserCreateWithoutOpenedTicketsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedTickets?: TicketCreateNestedManyWithoutAssignedToInput
    actorEvents?: TicketEventCreateNestedManyWithoutActorInput
    requestedReorders?: ReorderRequestCreateNestedManyWithoutRequestedByInput
    resolvedReorders?: ReorderRequestCreateNestedManyWithoutResolvedByInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    requestedHelp?: HelpRequestCreateNestedManyWithoutRequestedByInput
    helpResponses?: HelpRequestResponseCreateNestedManyWithoutResponderInput
    checkpoints?: CheckpointCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOpenedTicketsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedTickets?: TicketUncheckedCreateNestedManyWithoutAssignedToInput
    actorEvents?: TicketEventUncheckedCreateNestedManyWithoutActorInput
    requestedReorders?: ReorderRequestUncheckedCreateNestedManyWithoutRequestedByInput
    resolvedReorders?: ReorderRequestUncheckedCreateNestedManyWithoutResolvedByInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    requestedHelp?: HelpRequestUncheckedCreateNestedManyWithoutRequestedByInput
    helpResponses?: HelpRequestResponseUncheckedCreateNestedManyWithoutResponderInput
    checkpoints?: CheckpointUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOpenedTicketsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOpenedTicketsInput, UserUncheckedCreateWithoutOpenedTicketsInput>
  }

  export type UserCreateWithoutAssignedTicketsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    openedTickets?: TicketCreateNestedManyWithoutOpenedByInput
    actorEvents?: TicketEventCreateNestedManyWithoutActorInput
    requestedReorders?: ReorderRequestCreateNestedManyWithoutRequestedByInput
    resolvedReorders?: ReorderRequestCreateNestedManyWithoutResolvedByInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    requestedHelp?: HelpRequestCreateNestedManyWithoutRequestedByInput
    helpResponses?: HelpRequestResponseCreateNestedManyWithoutResponderInput
    checkpoints?: CheckpointCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAssignedTicketsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    openedTickets?: TicketUncheckedCreateNestedManyWithoutOpenedByInput
    actorEvents?: TicketEventUncheckedCreateNestedManyWithoutActorInput
    requestedReorders?: ReorderRequestUncheckedCreateNestedManyWithoutRequestedByInput
    resolvedReorders?: ReorderRequestUncheckedCreateNestedManyWithoutResolvedByInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    requestedHelp?: HelpRequestUncheckedCreateNestedManyWithoutRequestedByInput
    helpResponses?: HelpRequestResponseUncheckedCreateNestedManyWithoutResponderInput
    checkpoints?: CheckpointUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAssignedTicketsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAssignedTicketsInput, UserUncheckedCreateWithoutAssignedTicketsInput>
  }

  export type BugReportCreateWithoutTicketInput = {
    id?: string
    affectedModule: string
    stepsToReproduce: string
    expectedBehavior: string
    actualBehavior: string
    environment: $Enums.Environment
    customerId?: string | null
  }

  export type BugReportUncheckedCreateWithoutTicketInput = {
    id?: string
    affectedModule: string
    stepsToReproduce: string
    expectedBehavior: string
    actualBehavior: string
    environment: $Enums.Environment
    customerId?: string | null
  }

  export type BugReportCreateOrConnectWithoutTicketInput = {
    where: BugReportWhereUniqueInput
    create: XOR<BugReportCreateWithoutTicketInput, BugReportUncheckedCreateWithoutTicketInput>
  }

  export type TicketEventCreateWithoutTicketInput = {
    id?: string
    eventType: $Enums.TicketEventType
    metadata?: string
    createdAt?: Date | string
    actor: UserCreateNestedOneWithoutActorEventsInput
  }

  export type TicketEventUncheckedCreateWithoutTicketInput = {
    id?: string
    eventType: $Enums.TicketEventType
    actorId: string
    metadata?: string
    createdAt?: Date | string
  }

  export type TicketEventCreateOrConnectWithoutTicketInput = {
    where: TicketEventWhereUniqueInput
    create: XOR<TicketEventCreateWithoutTicketInput, TicketEventUncheckedCreateWithoutTicketInput>
  }

  export type TicketEventCreateManyTicketInputEnvelope = {
    data: TicketEventCreateManyTicketInput | TicketEventCreateManyTicketInput[]
  }

  export type ReorderRequestCreateWithoutTicketInput = {
    id?: string
    requestedPosition: number
    reason?: string | null
    status?: $Enums.ReorderStatus
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    requestedBy: UserCreateNestedOneWithoutRequestedReordersInput
    resolvedBy?: UserCreateNestedOneWithoutResolvedReordersInput
  }

  export type ReorderRequestUncheckedCreateWithoutTicketInput = {
    id?: string
    requestedById: string
    requestedPosition: number
    reason?: string | null
    status?: $Enums.ReorderStatus
    resolvedById?: string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ReorderRequestCreateOrConnectWithoutTicketInput = {
    where: ReorderRequestWhereUniqueInput
    create: XOR<ReorderRequestCreateWithoutTicketInput, ReorderRequestUncheckedCreateWithoutTicketInput>
  }

  export type ReorderRequestCreateManyTicketInputEnvelope = {
    data: ReorderRequestCreateManyTicketInput | ReorderRequestCreateManyTicketInput[]
  }

  export type NotificationCreateWithoutTicketInput = {
    id?: string
    type: $Enums.NotificationType
    title: string
    body: string
    isRead?: boolean
    requiresAck?: boolean
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutTicketInput = {
    id?: string
    userId: string
    type: $Enums.NotificationType
    title: string
    body: string
    isRead?: boolean
    requiresAck?: boolean
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutTicketInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutTicketInput, NotificationUncheckedCreateWithoutTicketInput>
  }

  export type NotificationCreateManyTicketInputEnvelope = {
    data: NotificationCreateManyTicketInput | NotificationCreateManyTicketInput[]
  }

  export type UserUpsertWithoutOpenedTicketsInput = {
    update: XOR<UserUpdateWithoutOpenedTicketsInput, UserUncheckedUpdateWithoutOpenedTicketsInput>
    create: XOR<UserCreateWithoutOpenedTicketsInput, UserUncheckedCreateWithoutOpenedTicketsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOpenedTicketsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOpenedTicketsInput, UserUncheckedUpdateWithoutOpenedTicketsInput>
  }

  export type UserUpdateWithoutOpenedTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedTickets?: TicketUpdateManyWithoutAssignedToNestedInput
    actorEvents?: TicketEventUpdateManyWithoutActorNestedInput
    requestedReorders?: ReorderRequestUpdateManyWithoutRequestedByNestedInput
    resolvedReorders?: ReorderRequestUpdateManyWithoutResolvedByNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    requestedHelp?: HelpRequestUpdateManyWithoutRequestedByNestedInput
    helpResponses?: HelpRequestResponseUpdateManyWithoutResponderNestedInput
    checkpoints?: CheckpointUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOpenedTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedTickets?: TicketUncheckedUpdateManyWithoutAssignedToNestedInput
    actorEvents?: TicketEventUncheckedUpdateManyWithoutActorNestedInput
    requestedReorders?: ReorderRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    resolvedReorders?: ReorderRequestUncheckedUpdateManyWithoutResolvedByNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    requestedHelp?: HelpRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    helpResponses?: HelpRequestResponseUncheckedUpdateManyWithoutResponderNestedInput
    checkpoints?: CheckpointUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutAssignedTicketsInput = {
    update: XOR<UserUpdateWithoutAssignedTicketsInput, UserUncheckedUpdateWithoutAssignedTicketsInput>
    create: XOR<UserCreateWithoutAssignedTicketsInput, UserUncheckedCreateWithoutAssignedTicketsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAssignedTicketsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAssignedTicketsInput, UserUncheckedUpdateWithoutAssignedTicketsInput>
  }

  export type UserUpdateWithoutAssignedTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    openedTickets?: TicketUpdateManyWithoutOpenedByNestedInput
    actorEvents?: TicketEventUpdateManyWithoutActorNestedInput
    requestedReorders?: ReorderRequestUpdateManyWithoutRequestedByNestedInput
    resolvedReorders?: ReorderRequestUpdateManyWithoutResolvedByNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    requestedHelp?: HelpRequestUpdateManyWithoutRequestedByNestedInput
    helpResponses?: HelpRequestResponseUpdateManyWithoutResponderNestedInput
    checkpoints?: CheckpointUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAssignedTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    openedTickets?: TicketUncheckedUpdateManyWithoutOpenedByNestedInput
    actorEvents?: TicketEventUncheckedUpdateManyWithoutActorNestedInput
    requestedReorders?: ReorderRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    resolvedReorders?: ReorderRequestUncheckedUpdateManyWithoutResolvedByNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    requestedHelp?: HelpRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    helpResponses?: HelpRequestResponseUncheckedUpdateManyWithoutResponderNestedInput
    checkpoints?: CheckpointUncheckedUpdateManyWithoutUserNestedInput
  }

  export type BugReportUpsertWithoutTicketInput = {
    update: XOR<BugReportUpdateWithoutTicketInput, BugReportUncheckedUpdateWithoutTicketInput>
    create: XOR<BugReportCreateWithoutTicketInput, BugReportUncheckedCreateWithoutTicketInput>
    where?: BugReportWhereInput
  }

  export type BugReportUpdateToOneWithWhereWithoutTicketInput = {
    where?: BugReportWhereInput
    data: XOR<BugReportUpdateWithoutTicketInput, BugReportUncheckedUpdateWithoutTicketInput>
  }

  export type BugReportUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    affectedModule?: StringFieldUpdateOperationsInput | string
    stepsToReproduce?: StringFieldUpdateOperationsInput | string
    expectedBehavior?: StringFieldUpdateOperationsInput | string
    actualBehavior?: StringFieldUpdateOperationsInput | string
    environment?: EnumEnvironmentFieldUpdateOperationsInput | $Enums.Environment
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BugReportUncheckedUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    affectedModule?: StringFieldUpdateOperationsInput | string
    stepsToReproduce?: StringFieldUpdateOperationsInput | string
    expectedBehavior?: StringFieldUpdateOperationsInput | string
    actualBehavior?: StringFieldUpdateOperationsInput | string
    environment?: EnumEnvironmentFieldUpdateOperationsInput | $Enums.Environment
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TicketEventUpsertWithWhereUniqueWithoutTicketInput = {
    where: TicketEventWhereUniqueInput
    update: XOR<TicketEventUpdateWithoutTicketInput, TicketEventUncheckedUpdateWithoutTicketInput>
    create: XOR<TicketEventCreateWithoutTicketInput, TicketEventUncheckedCreateWithoutTicketInput>
  }

  export type TicketEventUpdateWithWhereUniqueWithoutTicketInput = {
    where: TicketEventWhereUniqueInput
    data: XOR<TicketEventUpdateWithoutTicketInput, TicketEventUncheckedUpdateWithoutTicketInput>
  }

  export type TicketEventUpdateManyWithWhereWithoutTicketInput = {
    where: TicketEventScalarWhereInput
    data: XOR<TicketEventUpdateManyMutationInput, TicketEventUncheckedUpdateManyWithoutTicketInput>
  }

  export type ReorderRequestUpsertWithWhereUniqueWithoutTicketInput = {
    where: ReorderRequestWhereUniqueInput
    update: XOR<ReorderRequestUpdateWithoutTicketInput, ReorderRequestUncheckedUpdateWithoutTicketInput>
    create: XOR<ReorderRequestCreateWithoutTicketInput, ReorderRequestUncheckedCreateWithoutTicketInput>
  }

  export type ReorderRequestUpdateWithWhereUniqueWithoutTicketInput = {
    where: ReorderRequestWhereUniqueInput
    data: XOR<ReorderRequestUpdateWithoutTicketInput, ReorderRequestUncheckedUpdateWithoutTicketInput>
  }

  export type ReorderRequestUpdateManyWithWhereWithoutTicketInput = {
    where: ReorderRequestScalarWhereInput
    data: XOR<ReorderRequestUpdateManyMutationInput, ReorderRequestUncheckedUpdateManyWithoutTicketInput>
  }

  export type NotificationUpsertWithWhereUniqueWithoutTicketInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutTicketInput, NotificationUncheckedUpdateWithoutTicketInput>
    create: XOR<NotificationCreateWithoutTicketInput, NotificationUncheckedCreateWithoutTicketInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutTicketInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutTicketInput, NotificationUncheckedUpdateWithoutTicketInput>
  }

  export type NotificationUpdateManyWithWhereWithoutTicketInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutTicketInput>
  }

  export type TicketCreateWithoutBugReportInput = {
    id?: string
    publicId: string
    title: string
    description: string
    type: $Enums.TicketType
    severity: $Enums.Severity
    status?: $Enums.TicketStatus
    deadline: Date | string
    priorityOrder: number
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
    openedBy: UserCreateNestedOneWithoutOpenedTicketsInput
    assignedTo?: UserCreateNestedOneWithoutAssignedTicketsInput
    events?: TicketEventCreateNestedManyWithoutTicketInput
    reorderRequests?: ReorderRequestCreateNestedManyWithoutTicketInput
    notifications?: NotificationCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateWithoutBugReportInput = {
    id?: string
    publicId: string
    title: string
    description: string
    type: $Enums.TicketType
    severity: $Enums.Severity
    status?: $Enums.TicketStatus
    deadline: Date | string
    priorityOrder: number
    openedById: string
    assignedToId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
    events?: TicketEventUncheckedCreateNestedManyWithoutTicketInput
    reorderRequests?: ReorderRequestUncheckedCreateNestedManyWithoutTicketInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketCreateOrConnectWithoutBugReportInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutBugReportInput, TicketUncheckedCreateWithoutBugReportInput>
  }

  export type TicketUpsertWithoutBugReportInput = {
    update: XOR<TicketUpdateWithoutBugReportInput, TicketUncheckedUpdateWithoutBugReportInput>
    create: XOR<TicketCreateWithoutBugReportInput, TicketUncheckedCreateWithoutBugReportInput>
    where?: TicketWhereInput
  }

  export type TicketUpdateToOneWithWhereWithoutBugReportInput = {
    where?: TicketWhereInput
    data: XOR<TicketUpdateWithoutBugReportInput, TicketUncheckedUpdateWithoutBugReportInput>
  }

  export type TicketUpdateWithoutBugReportInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTicketTypeFieldUpdateOperationsInput | $Enums.TicketType
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    priorityOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openedBy?: UserUpdateOneRequiredWithoutOpenedTicketsNestedInput
    assignedTo?: UserUpdateOneWithoutAssignedTicketsNestedInput
    events?: TicketEventUpdateManyWithoutTicketNestedInput
    reorderRequests?: ReorderRequestUpdateManyWithoutTicketNestedInput
    notifications?: NotificationUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateWithoutBugReportInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTicketTypeFieldUpdateOperationsInput | $Enums.TicketType
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    priorityOrder?: IntFieldUpdateOperationsInput | number
    openedById?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    events?: TicketEventUncheckedUpdateManyWithoutTicketNestedInput
    reorderRequests?: ReorderRequestUncheckedUpdateManyWithoutTicketNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type TicketCreateWithoutEventsInput = {
    id?: string
    publicId: string
    title: string
    description: string
    type: $Enums.TicketType
    severity: $Enums.Severity
    status?: $Enums.TicketStatus
    deadline: Date | string
    priorityOrder: number
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
    openedBy: UserCreateNestedOneWithoutOpenedTicketsInput
    assignedTo?: UserCreateNestedOneWithoutAssignedTicketsInput
    bugReport?: BugReportCreateNestedOneWithoutTicketInput
    reorderRequests?: ReorderRequestCreateNestedManyWithoutTicketInput
    notifications?: NotificationCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateWithoutEventsInput = {
    id?: string
    publicId: string
    title: string
    description: string
    type: $Enums.TicketType
    severity: $Enums.Severity
    status?: $Enums.TicketStatus
    deadline: Date | string
    priorityOrder: number
    openedById: string
    assignedToId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
    bugReport?: BugReportUncheckedCreateNestedOneWithoutTicketInput
    reorderRequests?: ReorderRequestUncheckedCreateNestedManyWithoutTicketInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketCreateOrConnectWithoutEventsInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutEventsInput, TicketUncheckedCreateWithoutEventsInput>
  }

  export type UserCreateWithoutActorEventsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    openedTickets?: TicketCreateNestedManyWithoutOpenedByInput
    assignedTickets?: TicketCreateNestedManyWithoutAssignedToInput
    requestedReorders?: ReorderRequestCreateNestedManyWithoutRequestedByInput
    resolvedReorders?: ReorderRequestCreateNestedManyWithoutResolvedByInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    requestedHelp?: HelpRequestCreateNestedManyWithoutRequestedByInput
    helpResponses?: HelpRequestResponseCreateNestedManyWithoutResponderInput
    checkpoints?: CheckpointCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutActorEventsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    openedTickets?: TicketUncheckedCreateNestedManyWithoutOpenedByInput
    assignedTickets?: TicketUncheckedCreateNestedManyWithoutAssignedToInput
    requestedReorders?: ReorderRequestUncheckedCreateNestedManyWithoutRequestedByInput
    resolvedReorders?: ReorderRequestUncheckedCreateNestedManyWithoutResolvedByInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    requestedHelp?: HelpRequestUncheckedCreateNestedManyWithoutRequestedByInput
    helpResponses?: HelpRequestResponseUncheckedCreateNestedManyWithoutResponderInput
    checkpoints?: CheckpointUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutActorEventsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutActorEventsInput, UserUncheckedCreateWithoutActorEventsInput>
  }

  export type TicketUpsertWithoutEventsInput = {
    update: XOR<TicketUpdateWithoutEventsInput, TicketUncheckedUpdateWithoutEventsInput>
    create: XOR<TicketCreateWithoutEventsInput, TicketUncheckedCreateWithoutEventsInput>
    where?: TicketWhereInput
  }

  export type TicketUpdateToOneWithWhereWithoutEventsInput = {
    where?: TicketWhereInput
    data: XOR<TicketUpdateWithoutEventsInput, TicketUncheckedUpdateWithoutEventsInput>
  }

  export type TicketUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTicketTypeFieldUpdateOperationsInput | $Enums.TicketType
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    priorityOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openedBy?: UserUpdateOneRequiredWithoutOpenedTicketsNestedInput
    assignedTo?: UserUpdateOneWithoutAssignedTicketsNestedInput
    bugReport?: BugReportUpdateOneWithoutTicketNestedInput
    reorderRequests?: ReorderRequestUpdateManyWithoutTicketNestedInput
    notifications?: NotificationUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTicketTypeFieldUpdateOperationsInput | $Enums.TicketType
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    priorityOrder?: IntFieldUpdateOperationsInput | number
    openedById?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bugReport?: BugReportUncheckedUpdateOneWithoutTicketNestedInput
    reorderRequests?: ReorderRequestUncheckedUpdateManyWithoutTicketNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type UserUpsertWithoutActorEventsInput = {
    update: XOR<UserUpdateWithoutActorEventsInput, UserUncheckedUpdateWithoutActorEventsInput>
    create: XOR<UserCreateWithoutActorEventsInput, UserUncheckedCreateWithoutActorEventsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutActorEventsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutActorEventsInput, UserUncheckedUpdateWithoutActorEventsInput>
  }

  export type UserUpdateWithoutActorEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    openedTickets?: TicketUpdateManyWithoutOpenedByNestedInput
    assignedTickets?: TicketUpdateManyWithoutAssignedToNestedInput
    requestedReorders?: ReorderRequestUpdateManyWithoutRequestedByNestedInput
    resolvedReorders?: ReorderRequestUpdateManyWithoutResolvedByNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    requestedHelp?: HelpRequestUpdateManyWithoutRequestedByNestedInput
    helpResponses?: HelpRequestResponseUpdateManyWithoutResponderNestedInput
    checkpoints?: CheckpointUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutActorEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    openedTickets?: TicketUncheckedUpdateManyWithoutOpenedByNestedInput
    assignedTickets?: TicketUncheckedUpdateManyWithoutAssignedToNestedInput
    requestedReorders?: ReorderRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    resolvedReorders?: ReorderRequestUncheckedUpdateManyWithoutResolvedByNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    requestedHelp?: HelpRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    helpResponses?: HelpRequestResponseUncheckedUpdateManyWithoutResponderNestedInput
    checkpoints?: CheckpointUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TicketCreateWithoutReorderRequestsInput = {
    id?: string
    publicId: string
    title: string
    description: string
    type: $Enums.TicketType
    severity: $Enums.Severity
    status?: $Enums.TicketStatus
    deadline: Date | string
    priorityOrder: number
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
    openedBy: UserCreateNestedOneWithoutOpenedTicketsInput
    assignedTo?: UserCreateNestedOneWithoutAssignedTicketsInput
    bugReport?: BugReportCreateNestedOneWithoutTicketInput
    events?: TicketEventCreateNestedManyWithoutTicketInput
    notifications?: NotificationCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateWithoutReorderRequestsInput = {
    id?: string
    publicId: string
    title: string
    description: string
    type: $Enums.TicketType
    severity: $Enums.Severity
    status?: $Enums.TicketStatus
    deadline: Date | string
    priorityOrder: number
    openedById: string
    assignedToId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
    bugReport?: BugReportUncheckedCreateNestedOneWithoutTicketInput
    events?: TicketEventUncheckedCreateNestedManyWithoutTicketInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketCreateOrConnectWithoutReorderRequestsInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutReorderRequestsInput, TicketUncheckedCreateWithoutReorderRequestsInput>
  }

  export type UserCreateWithoutRequestedReordersInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    openedTickets?: TicketCreateNestedManyWithoutOpenedByInput
    assignedTickets?: TicketCreateNestedManyWithoutAssignedToInput
    actorEvents?: TicketEventCreateNestedManyWithoutActorInput
    resolvedReorders?: ReorderRequestCreateNestedManyWithoutResolvedByInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    requestedHelp?: HelpRequestCreateNestedManyWithoutRequestedByInput
    helpResponses?: HelpRequestResponseCreateNestedManyWithoutResponderInput
    checkpoints?: CheckpointCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRequestedReordersInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    openedTickets?: TicketUncheckedCreateNestedManyWithoutOpenedByInput
    assignedTickets?: TicketUncheckedCreateNestedManyWithoutAssignedToInput
    actorEvents?: TicketEventUncheckedCreateNestedManyWithoutActorInput
    resolvedReorders?: ReorderRequestUncheckedCreateNestedManyWithoutResolvedByInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    requestedHelp?: HelpRequestUncheckedCreateNestedManyWithoutRequestedByInput
    helpResponses?: HelpRequestResponseUncheckedCreateNestedManyWithoutResponderInput
    checkpoints?: CheckpointUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRequestedReordersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRequestedReordersInput, UserUncheckedCreateWithoutRequestedReordersInput>
  }

  export type UserCreateWithoutResolvedReordersInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    openedTickets?: TicketCreateNestedManyWithoutOpenedByInput
    assignedTickets?: TicketCreateNestedManyWithoutAssignedToInput
    actorEvents?: TicketEventCreateNestedManyWithoutActorInput
    requestedReorders?: ReorderRequestCreateNestedManyWithoutRequestedByInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    requestedHelp?: HelpRequestCreateNestedManyWithoutRequestedByInput
    helpResponses?: HelpRequestResponseCreateNestedManyWithoutResponderInput
    checkpoints?: CheckpointCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutResolvedReordersInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    openedTickets?: TicketUncheckedCreateNestedManyWithoutOpenedByInput
    assignedTickets?: TicketUncheckedCreateNestedManyWithoutAssignedToInput
    actorEvents?: TicketEventUncheckedCreateNestedManyWithoutActorInput
    requestedReorders?: ReorderRequestUncheckedCreateNestedManyWithoutRequestedByInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    requestedHelp?: HelpRequestUncheckedCreateNestedManyWithoutRequestedByInput
    helpResponses?: HelpRequestResponseUncheckedCreateNestedManyWithoutResponderInput
    checkpoints?: CheckpointUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutResolvedReordersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutResolvedReordersInput, UserUncheckedCreateWithoutResolvedReordersInput>
  }

  export type TicketUpsertWithoutReorderRequestsInput = {
    update: XOR<TicketUpdateWithoutReorderRequestsInput, TicketUncheckedUpdateWithoutReorderRequestsInput>
    create: XOR<TicketCreateWithoutReorderRequestsInput, TicketUncheckedCreateWithoutReorderRequestsInput>
    where?: TicketWhereInput
  }

  export type TicketUpdateToOneWithWhereWithoutReorderRequestsInput = {
    where?: TicketWhereInput
    data: XOR<TicketUpdateWithoutReorderRequestsInput, TicketUncheckedUpdateWithoutReorderRequestsInput>
  }

  export type TicketUpdateWithoutReorderRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTicketTypeFieldUpdateOperationsInput | $Enums.TicketType
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    priorityOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openedBy?: UserUpdateOneRequiredWithoutOpenedTicketsNestedInput
    assignedTo?: UserUpdateOneWithoutAssignedTicketsNestedInput
    bugReport?: BugReportUpdateOneWithoutTicketNestedInput
    events?: TicketEventUpdateManyWithoutTicketNestedInput
    notifications?: NotificationUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateWithoutReorderRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTicketTypeFieldUpdateOperationsInput | $Enums.TicketType
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    priorityOrder?: IntFieldUpdateOperationsInput | number
    openedById?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bugReport?: BugReportUncheckedUpdateOneWithoutTicketNestedInput
    events?: TicketEventUncheckedUpdateManyWithoutTicketNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type UserUpsertWithoutRequestedReordersInput = {
    update: XOR<UserUpdateWithoutRequestedReordersInput, UserUncheckedUpdateWithoutRequestedReordersInput>
    create: XOR<UserCreateWithoutRequestedReordersInput, UserUncheckedCreateWithoutRequestedReordersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRequestedReordersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRequestedReordersInput, UserUncheckedUpdateWithoutRequestedReordersInput>
  }

  export type UserUpdateWithoutRequestedReordersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    openedTickets?: TicketUpdateManyWithoutOpenedByNestedInput
    assignedTickets?: TicketUpdateManyWithoutAssignedToNestedInput
    actorEvents?: TicketEventUpdateManyWithoutActorNestedInput
    resolvedReorders?: ReorderRequestUpdateManyWithoutResolvedByNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    requestedHelp?: HelpRequestUpdateManyWithoutRequestedByNestedInput
    helpResponses?: HelpRequestResponseUpdateManyWithoutResponderNestedInput
    checkpoints?: CheckpointUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRequestedReordersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    openedTickets?: TicketUncheckedUpdateManyWithoutOpenedByNestedInput
    assignedTickets?: TicketUncheckedUpdateManyWithoutAssignedToNestedInput
    actorEvents?: TicketEventUncheckedUpdateManyWithoutActorNestedInput
    resolvedReorders?: ReorderRequestUncheckedUpdateManyWithoutResolvedByNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    requestedHelp?: HelpRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    helpResponses?: HelpRequestResponseUncheckedUpdateManyWithoutResponderNestedInput
    checkpoints?: CheckpointUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutResolvedReordersInput = {
    update: XOR<UserUpdateWithoutResolvedReordersInput, UserUncheckedUpdateWithoutResolvedReordersInput>
    create: XOR<UserCreateWithoutResolvedReordersInput, UserUncheckedCreateWithoutResolvedReordersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutResolvedReordersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutResolvedReordersInput, UserUncheckedUpdateWithoutResolvedReordersInput>
  }

  export type UserUpdateWithoutResolvedReordersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    openedTickets?: TicketUpdateManyWithoutOpenedByNestedInput
    assignedTickets?: TicketUpdateManyWithoutAssignedToNestedInput
    actorEvents?: TicketEventUpdateManyWithoutActorNestedInput
    requestedReorders?: ReorderRequestUpdateManyWithoutRequestedByNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    requestedHelp?: HelpRequestUpdateManyWithoutRequestedByNestedInput
    helpResponses?: HelpRequestResponseUpdateManyWithoutResponderNestedInput
    checkpoints?: CheckpointUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutResolvedReordersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    openedTickets?: TicketUncheckedUpdateManyWithoutOpenedByNestedInput
    assignedTickets?: TicketUncheckedUpdateManyWithoutAssignedToNestedInput
    actorEvents?: TicketEventUncheckedUpdateManyWithoutActorNestedInput
    requestedReorders?: ReorderRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    requestedHelp?: HelpRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    helpResponses?: HelpRequestResponseUncheckedUpdateManyWithoutResponderNestedInput
    checkpoints?: CheckpointUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutNotificationsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    openedTickets?: TicketCreateNestedManyWithoutOpenedByInput
    assignedTickets?: TicketCreateNestedManyWithoutAssignedToInput
    actorEvents?: TicketEventCreateNestedManyWithoutActorInput
    requestedReorders?: ReorderRequestCreateNestedManyWithoutRequestedByInput
    resolvedReorders?: ReorderRequestCreateNestedManyWithoutResolvedByInput
    requestedHelp?: HelpRequestCreateNestedManyWithoutRequestedByInput
    helpResponses?: HelpRequestResponseCreateNestedManyWithoutResponderInput
    checkpoints?: CheckpointCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNotificationsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    openedTickets?: TicketUncheckedCreateNestedManyWithoutOpenedByInput
    assignedTickets?: TicketUncheckedCreateNestedManyWithoutAssignedToInput
    actorEvents?: TicketEventUncheckedCreateNestedManyWithoutActorInput
    requestedReorders?: ReorderRequestUncheckedCreateNestedManyWithoutRequestedByInput
    resolvedReorders?: ReorderRequestUncheckedCreateNestedManyWithoutResolvedByInput
    requestedHelp?: HelpRequestUncheckedCreateNestedManyWithoutRequestedByInput
    helpResponses?: HelpRequestResponseUncheckedCreateNestedManyWithoutResponderInput
    checkpoints?: CheckpointUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
  }

  export type TicketCreateWithoutNotificationsInput = {
    id?: string
    publicId: string
    title: string
    description: string
    type: $Enums.TicketType
    severity: $Enums.Severity
    status?: $Enums.TicketStatus
    deadline: Date | string
    priorityOrder: number
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
    openedBy: UserCreateNestedOneWithoutOpenedTicketsInput
    assignedTo?: UserCreateNestedOneWithoutAssignedTicketsInput
    bugReport?: BugReportCreateNestedOneWithoutTicketInput
    events?: TicketEventCreateNestedManyWithoutTicketInput
    reorderRequests?: ReorderRequestCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateWithoutNotificationsInput = {
    id?: string
    publicId: string
    title: string
    description: string
    type: $Enums.TicketType
    severity: $Enums.Severity
    status?: $Enums.TicketStatus
    deadline: Date | string
    priorityOrder: number
    openedById: string
    assignedToId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
    bugReport?: BugReportUncheckedCreateNestedOneWithoutTicketInput
    events?: TicketEventUncheckedCreateNestedManyWithoutTicketInput
    reorderRequests?: ReorderRequestUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketCreateOrConnectWithoutNotificationsInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutNotificationsInput, TicketUncheckedCreateWithoutNotificationsInput>
  }

  export type UserUpsertWithoutNotificationsInput = {
    update: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    openedTickets?: TicketUpdateManyWithoutOpenedByNestedInput
    assignedTickets?: TicketUpdateManyWithoutAssignedToNestedInput
    actorEvents?: TicketEventUpdateManyWithoutActorNestedInput
    requestedReorders?: ReorderRequestUpdateManyWithoutRequestedByNestedInput
    resolvedReorders?: ReorderRequestUpdateManyWithoutResolvedByNestedInput
    requestedHelp?: HelpRequestUpdateManyWithoutRequestedByNestedInput
    helpResponses?: HelpRequestResponseUpdateManyWithoutResponderNestedInput
    checkpoints?: CheckpointUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    openedTickets?: TicketUncheckedUpdateManyWithoutOpenedByNestedInput
    assignedTickets?: TicketUncheckedUpdateManyWithoutAssignedToNestedInput
    actorEvents?: TicketEventUncheckedUpdateManyWithoutActorNestedInput
    requestedReorders?: ReorderRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    resolvedReorders?: ReorderRequestUncheckedUpdateManyWithoutResolvedByNestedInput
    requestedHelp?: HelpRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    helpResponses?: HelpRequestResponseUncheckedUpdateManyWithoutResponderNestedInput
    checkpoints?: CheckpointUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TicketUpsertWithoutNotificationsInput = {
    update: XOR<TicketUpdateWithoutNotificationsInput, TicketUncheckedUpdateWithoutNotificationsInput>
    create: XOR<TicketCreateWithoutNotificationsInput, TicketUncheckedCreateWithoutNotificationsInput>
    where?: TicketWhereInput
  }

  export type TicketUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: TicketWhereInput
    data: XOR<TicketUpdateWithoutNotificationsInput, TicketUncheckedUpdateWithoutNotificationsInput>
  }

  export type TicketUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTicketTypeFieldUpdateOperationsInput | $Enums.TicketType
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    priorityOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openedBy?: UserUpdateOneRequiredWithoutOpenedTicketsNestedInput
    assignedTo?: UserUpdateOneWithoutAssignedTicketsNestedInput
    bugReport?: BugReportUpdateOneWithoutTicketNestedInput
    events?: TicketEventUpdateManyWithoutTicketNestedInput
    reorderRequests?: ReorderRequestUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTicketTypeFieldUpdateOperationsInput | $Enums.TicketType
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    priorityOrder?: IntFieldUpdateOperationsInput | number
    openedById?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bugReport?: BugReportUncheckedUpdateOneWithoutTicketNestedInput
    events?: TicketEventUncheckedUpdateManyWithoutTicketNestedInput
    reorderRequests?: ReorderRequestUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type UserCreateWithoutRequestedHelpInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    openedTickets?: TicketCreateNestedManyWithoutOpenedByInput
    assignedTickets?: TicketCreateNestedManyWithoutAssignedToInput
    actorEvents?: TicketEventCreateNestedManyWithoutActorInput
    requestedReorders?: ReorderRequestCreateNestedManyWithoutRequestedByInput
    resolvedReorders?: ReorderRequestCreateNestedManyWithoutResolvedByInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    helpResponses?: HelpRequestResponseCreateNestedManyWithoutResponderInput
    checkpoints?: CheckpointCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRequestedHelpInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    openedTickets?: TicketUncheckedCreateNestedManyWithoutOpenedByInput
    assignedTickets?: TicketUncheckedCreateNestedManyWithoutAssignedToInput
    actorEvents?: TicketEventUncheckedCreateNestedManyWithoutActorInput
    requestedReorders?: ReorderRequestUncheckedCreateNestedManyWithoutRequestedByInput
    resolvedReorders?: ReorderRequestUncheckedCreateNestedManyWithoutResolvedByInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    helpResponses?: HelpRequestResponseUncheckedCreateNestedManyWithoutResponderInput
    checkpoints?: CheckpointUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRequestedHelpInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRequestedHelpInput, UserUncheckedCreateWithoutRequestedHelpInput>
  }

  export type HelpRequestResponseCreateWithoutHelpRequestInput = {
    id?: string
    respondedAt?: Date | string
    responder: UserCreateNestedOneWithoutHelpResponsesInput
  }

  export type HelpRequestResponseUncheckedCreateWithoutHelpRequestInput = {
    id?: string
    responderId: string
    respondedAt?: Date | string
  }

  export type HelpRequestResponseCreateOrConnectWithoutHelpRequestInput = {
    where: HelpRequestResponseWhereUniqueInput
    create: XOR<HelpRequestResponseCreateWithoutHelpRequestInput, HelpRequestResponseUncheckedCreateWithoutHelpRequestInput>
  }

  export type HelpRequestResponseCreateManyHelpRequestInputEnvelope = {
    data: HelpRequestResponseCreateManyHelpRequestInput | HelpRequestResponseCreateManyHelpRequestInput[]
  }

  export type UserUpsertWithoutRequestedHelpInput = {
    update: XOR<UserUpdateWithoutRequestedHelpInput, UserUncheckedUpdateWithoutRequestedHelpInput>
    create: XOR<UserCreateWithoutRequestedHelpInput, UserUncheckedCreateWithoutRequestedHelpInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRequestedHelpInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRequestedHelpInput, UserUncheckedUpdateWithoutRequestedHelpInput>
  }

  export type UserUpdateWithoutRequestedHelpInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    openedTickets?: TicketUpdateManyWithoutOpenedByNestedInput
    assignedTickets?: TicketUpdateManyWithoutAssignedToNestedInput
    actorEvents?: TicketEventUpdateManyWithoutActorNestedInput
    requestedReorders?: ReorderRequestUpdateManyWithoutRequestedByNestedInput
    resolvedReorders?: ReorderRequestUpdateManyWithoutResolvedByNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    helpResponses?: HelpRequestResponseUpdateManyWithoutResponderNestedInput
    checkpoints?: CheckpointUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRequestedHelpInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    openedTickets?: TicketUncheckedUpdateManyWithoutOpenedByNestedInput
    assignedTickets?: TicketUncheckedUpdateManyWithoutAssignedToNestedInput
    actorEvents?: TicketEventUncheckedUpdateManyWithoutActorNestedInput
    requestedReorders?: ReorderRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    resolvedReorders?: ReorderRequestUncheckedUpdateManyWithoutResolvedByNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    helpResponses?: HelpRequestResponseUncheckedUpdateManyWithoutResponderNestedInput
    checkpoints?: CheckpointUncheckedUpdateManyWithoutUserNestedInput
  }

  export type HelpRequestResponseUpsertWithWhereUniqueWithoutHelpRequestInput = {
    where: HelpRequestResponseWhereUniqueInput
    update: XOR<HelpRequestResponseUpdateWithoutHelpRequestInput, HelpRequestResponseUncheckedUpdateWithoutHelpRequestInput>
    create: XOR<HelpRequestResponseCreateWithoutHelpRequestInput, HelpRequestResponseUncheckedCreateWithoutHelpRequestInput>
  }

  export type HelpRequestResponseUpdateWithWhereUniqueWithoutHelpRequestInput = {
    where: HelpRequestResponseWhereUniqueInput
    data: XOR<HelpRequestResponseUpdateWithoutHelpRequestInput, HelpRequestResponseUncheckedUpdateWithoutHelpRequestInput>
  }

  export type HelpRequestResponseUpdateManyWithWhereWithoutHelpRequestInput = {
    where: HelpRequestResponseScalarWhereInput
    data: XOR<HelpRequestResponseUpdateManyMutationInput, HelpRequestResponseUncheckedUpdateManyWithoutHelpRequestInput>
  }

  export type HelpRequestCreateWithoutResponsesInput = {
    id?: string
    contextMessage: string
    createdAt?: Date | string
    requestedBy: UserCreateNestedOneWithoutRequestedHelpInput
  }

  export type HelpRequestUncheckedCreateWithoutResponsesInput = {
    id?: string
    requestedById: string
    contextMessage: string
    createdAt?: Date | string
  }

  export type HelpRequestCreateOrConnectWithoutResponsesInput = {
    where: HelpRequestWhereUniqueInput
    create: XOR<HelpRequestCreateWithoutResponsesInput, HelpRequestUncheckedCreateWithoutResponsesInput>
  }

  export type UserCreateWithoutHelpResponsesInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    openedTickets?: TicketCreateNestedManyWithoutOpenedByInput
    assignedTickets?: TicketCreateNestedManyWithoutAssignedToInput
    actorEvents?: TicketEventCreateNestedManyWithoutActorInput
    requestedReorders?: ReorderRequestCreateNestedManyWithoutRequestedByInput
    resolvedReorders?: ReorderRequestCreateNestedManyWithoutResolvedByInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    requestedHelp?: HelpRequestCreateNestedManyWithoutRequestedByInput
    checkpoints?: CheckpointCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutHelpResponsesInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    openedTickets?: TicketUncheckedCreateNestedManyWithoutOpenedByInput
    assignedTickets?: TicketUncheckedCreateNestedManyWithoutAssignedToInput
    actorEvents?: TicketEventUncheckedCreateNestedManyWithoutActorInput
    requestedReorders?: ReorderRequestUncheckedCreateNestedManyWithoutRequestedByInput
    resolvedReorders?: ReorderRequestUncheckedCreateNestedManyWithoutResolvedByInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    requestedHelp?: HelpRequestUncheckedCreateNestedManyWithoutRequestedByInput
    checkpoints?: CheckpointUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutHelpResponsesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutHelpResponsesInput, UserUncheckedCreateWithoutHelpResponsesInput>
  }

  export type HelpRequestUpsertWithoutResponsesInput = {
    update: XOR<HelpRequestUpdateWithoutResponsesInput, HelpRequestUncheckedUpdateWithoutResponsesInput>
    create: XOR<HelpRequestCreateWithoutResponsesInput, HelpRequestUncheckedCreateWithoutResponsesInput>
    where?: HelpRequestWhereInput
  }

  export type HelpRequestUpdateToOneWithWhereWithoutResponsesInput = {
    where?: HelpRequestWhereInput
    data: XOR<HelpRequestUpdateWithoutResponsesInput, HelpRequestUncheckedUpdateWithoutResponsesInput>
  }

  export type HelpRequestUpdateWithoutResponsesInput = {
    id?: StringFieldUpdateOperationsInput | string
    contextMessage?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: UserUpdateOneRequiredWithoutRequestedHelpNestedInput
  }

  export type HelpRequestUncheckedUpdateWithoutResponsesInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedById?: StringFieldUpdateOperationsInput | string
    contextMessage?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutHelpResponsesInput = {
    update: XOR<UserUpdateWithoutHelpResponsesInput, UserUncheckedUpdateWithoutHelpResponsesInput>
    create: XOR<UserCreateWithoutHelpResponsesInput, UserUncheckedCreateWithoutHelpResponsesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutHelpResponsesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutHelpResponsesInput, UserUncheckedUpdateWithoutHelpResponsesInput>
  }

  export type UserUpdateWithoutHelpResponsesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    openedTickets?: TicketUpdateManyWithoutOpenedByNestedInput
    assignedTickets?: TicketUpdateManyWithoutAssignedToNestedInput
    actorEvents?: TicketEventUpdateManyWithoutActorNestedInput
    requestedReorders?: ReorderRequestUpdateManyWithoutRequestedByNestedInput
    resolvedReorders?: ReorderRequestUpdateManyWithoutResolvedByNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    requestedHelp?: HelpRequestUpdateManyWithoutRequestedByNestedInput
    checkpoints?: CheckpointUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutHelpResponsesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    openedTickets?: TicketUncheckedUpdateManyWithoutOpenedByNestedInput
    assignedTickets?: TicketUncheckedUpdateManyWithoutAssignedToNestedInput
    actorEvents?: TicketEventUncheckedUpdateManyWithoutActorNestedInput
    requestedReorders?: ReorderRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    resolvedReorders?: ReorderRequestUncheckedUpdateManyWithoutResolvedByNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    requestedHelp?: HelpRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    checkpoints?: CheckpointUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutCheckpointsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    openedTickets?: TicketCreateNestedManyWithoutOpenedByInput
    assignedTickets?: TicketCreateNestedManyWithoutAssignedToInput
    actorEvents?: TicketEventCreateNestedManyWithoutActorInput
    requestedReorders?: ReorderRequestCreateNestedManyWithoutRequestedByInput
    resolvedReorders?: ReorderRequestCreateNestedManyWithoutResolvedByInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    requestedHelp?: HelpRequestCreateNestedManyWithoutRequestedByInput
    helpResponses?: HelpRequestResponseCreateNestedManyWithoutResponderInput
  }

  export type UserUncheckedCreateWithoutCheckpointsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatarUrl?: string | null
    ninjaAlias: string
    isActive?: boolean
    notifyTickets?: boolean
    notifyBugs?: boolean
    soundEnabled?: boolean
    devStatus?: $Enums.DevStatus | null
    currentTask?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    openedTickets?: TicketUncheckedCreateNestedManyWithoutOpenedByInput
    assignedTickets?: TicketUncheckedCreateNestedManyWithoutAssignedToInput
    actorEvents?: TicketEventUncheckedCreateNestedManyWithoutActorInput
    requestedReorders?: ReorderRequestUncheckedCreateNestedManyWithoutRequestedByInput
    resolvedReorders?: ReorderRequestUncheckedCreateNestedManyWithoutResolvedByInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    requestedHelp?: HelpRequestUncheckedCreateNestedManyWithoutRequestedByInput
    helpResponses?: HelpRequestResponseUncheckedCreateNestedManyWithoutResponderInput
  }

  export type UserCreateOrConnectWithoutCheckpointsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCheckpointsInput, UserUncheckedCreateWithoutCheckpointsInput>
  }

  export type UserUpsertWithoutCheckpointsInput = {
    update: XOR<UserUpdateWithoutCheckpointsInput, UserUncheckedUpdateWithoutCheckpointsInput>
    create: XOR<UserCreateWithoutCheckpointsInput, UserUncheckedCreateWithoutCheckpointsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCheckpointsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCheckpointsInput, UserUncheckedUpdateWithoutCheckpointsInput>
  }

  export type UserUpdateWithoutCheckpointsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    openedTickets?: TicketUpdateManyWithoutOpenedByNestedInput
    assignedTickets?: TicketUpdateManyWithoutAssignedToNestedInput
    actorEvents?: TicketEventUpdateManyWithoutActorNestedInput
    requestedReorders?: ReorderRequestUpdateManyWithoutRequestedByNestedInput
    resolvedReorders?: ReorderRequestUpdateManyWithoutResolvedByNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    requestedHelp?: HelpRequestUpdateManyWithoutRequestedByNestedInput
    helpResponses?: HelpRequestResponseUpdateManyWithoutResponderNestedInput
  }

  export type UserUncheckedUpdateWithoutCheckpointsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ninjaAlias?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    notifyTickets?: BoolFieldUpdateOperationsInput | boolean
    notifyBugs?: BoolFieldUpdateOperationsInput | boolean
    soundEnabled?: BoolFieldUpdateOperationsInput | boolean
    devStatus?: NullableEnumDevStatusFieldUpdateOperationsInput | $Enums.DevStatus | null
    currentTask?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    openedTickets?: TicketUncheckedUpdateManyWithoutOpenedByNestedInput
    assignedTickets?: TicketUncheckedUpdateManyWithoutAssignedToNestedInput
    actorEvents?: TicketEventUncheckedUpdateManyWithoutActorNestedInput
    requestedReorders?: ReorderRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    resolvedReorders?: ReorderRequestUncheckedUpdateManyWithoutResolvedByNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    requestedHelp?: HelpRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    helpResponses?: HelpRequestResponseUncheckedUpdateManyWithoutResponderNestedInput
  }

  export type TicketCreateManyOpenedByInput = {
    id?: string
    publicId: string
    title: string
    description: string
    type: $Enums.TicketType
    severity: $Enums.Severity
    status?: $Enums.TicketStatus
    deadline: Date | string
    priorityOrder: number
    assignedToId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
  }

  export type TicketCreateManyAssignedToInput = {
    id?: string
    publicId: string
    title: string
    description: string
    type: $Enums.TicketType
    severity: $Enums.Severity
    status?: $Enums.TicketStatus
    deadline: Date | string
    priorityOrder: number
    openedById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
  }

  export type TicketEventCreateManyActorInput = {
    id?: string
    ticketId: string
    eventType: $Enums.TicketEventType
    metadata?: string
    createdAt?: Date | string
  }

  export type ReorderRequestCreateManyRequestedByInput = {
    id?: string
    ticketId: string
    requestedPosition: number
    reason?: string | null
    status?: $Enums.ReorderStatus
    resolvedById?: string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ReorderRequestCreateManyResolvedByInput = {
    id?: string
    ticketId: string
    requestedById: string
    requestedPosition: number
    reason?: string | null
    status?: $Enums.ReorderStatus
    resolvedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationCreateManyUserInput = {
    id?: string
    type: $Enums.NotificationType
    title: string
    body: string
    ticketId?: string | null
    isRead?: boolean
    requiresAck?: boolean
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type HelpRequestCreateManyRequestedByInput = {
    id?: string
    contextMessage: string
    createdAt?: Date | string
  }

  export type HelpRequestResponseCreateManyResponderInput = {
    id?: string
    helpRequestId: string
    respondedAt?: Date | string
  }

  export type CheckpointCreateManyUserInput = {
    id?: string
    currentTask: string
    isBlocked: boolean
    notes?: string | null
    createdAt?: Date | string
  }

  export type TicketUpdateWithoutOpenedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTicketTypeFieldUpdateOperationsInput | $Enums.TicketType
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    priorityOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    assignedTo?: UserUpdateOneWithoutAssignedTicketsNestedInput
    bugReport?: BugReportUpdateOneWithoutTicketNestedInput
    events?: TicketEventUpdateManyWithoutTicketNestedInput
    reorderRequests?: ReorderRequestUpdateManyWithoutTicketNestedInput
    notifications?: NotificationUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateWithoutOpenedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTicketTypeFieldUpdateOperationsInput | $Enums.TicketType
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    priorityOrder?: IntFieldUpdateOperationsInput | number
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bugReport?: BugReportUncheckedUpdateOneWithoutTicketNestedInput
    events?: TicketEventUncheckedUpdateManyWithoutTicketNestedInput
    reorderRequests?: ReorderRequestUncheckedUpdateManyWithoutTicketNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateManyWithoutOpenedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTicketTypeFieldUpdateOperationsInput | $Enums.TicketType
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    priorityOrder?: IntFieldUpdateOperationsInput | number
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TicketUpdateWithoutAssignedToInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTicketTypeFieldUpdateOperationsInput | $Enums.TicketType
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    priorityOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openedBy?: UserUpdateOneRequiredWithoutOpenedTicketsNestedInput
    bugReport?: BugReportUpdateOneWithoutTicketNestedInput
    events?: TicketEventUpdateManyWithoutTicketNestedInput
    reorderRequests?: ReorderRequestUpdateManyWithoutTicketNestedInput
    notifications?: NotificationUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateWithoutAssignedToInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTicketTypeFieldUpdateOperationsInput | $Enums.TicketType
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    priorityOrder?: IntFieldUpdateOperationsInput | number
    openedById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bugReport?: BugReportUncheckedUpdateOneWithoutTicketNestedInput
    events?: TicketEventUncheckedUpdateManyWithoutTicketNestedInput
    reorderRequests?: ReorderRequestUncheckedUpdateManyWithoutTicketNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateManyWithoutAssignedToInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTicketTypeFieldUpdateOperationsInput | $Enums.TicketType
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    priorityOrder?: IntFieldUpdateOperationsInput | number
    openedById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TicketEventUpdateWithoutActorInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: EnumTicketEventTypeFieldUpdateOperationsInput | $Enums.TicketEventType
    metadata?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticket?: TicketUpdateOneRequiredWithoutEventsNestedInput
  }

  export type TicketEventUncheckedUpdateWithoutActorInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    eventType?: EnumTicketEventTypeFieldUpdateOperationsInput | $Enums.TicketEventType
    metadata?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketEventUncheckedUpdateManyWithoutActorInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    eventType?: EnumTicketEventTypeFieldUpdateOperationsInput | $Enums.TicketEventType
    metadata?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReorderRequestUpdateWithoutRequestedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedPosition?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReorderStatusFieldUpdateOperationsInput | $Enums.ReorderStatus
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticket?: TicketUpdateOneRequiredWithoutReorderRequestsNestedInput
    resolvedBy?: UserUpdateOneWithoutResolvedReordersNestedInput
  }

  export type ReorderRequestUncheckedUpdateWithoutRequestedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    requestedPosition?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReorderStatusFieldUpdateOperationsInput | $Enums.ReorderStatus
    resolvedById?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReorderRequestUncheckedUpdateManyWithoutRequestedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    requestedPosition?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReorderStatusFieldUpdateOperationsInput | $Enums.ReorderStatus
    resolvedById?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReorderRequestUpdateWithoutResolvedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedPosition?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReorderStatusFieldUpdateOperationsInput | $Enums.ReorderStatus
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticket?: TicketUpdateOneRequiredWithoutReorderRequestsNestedInput
    requestedBy?: UserUpdateOneRequiredWithoutRequestedReordersNestedInput
  }

  export type ReorderRequestUncheckedUpdateWithoutResolvedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    requestedById?: StringFieldUpdateOperationsInput | string
    requestedPosition?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReorderStatusFieldUpdateOperationsInput | $Enums.ReorderStatus
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReorderRequestUncheckedUpdateManyWithoutResolvedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    requestedById?: StringFieldUpdateOperationsInput | string
    requestedPosition?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReorderStatusFieldUpdateOperationsInput | $Enums.ReorderStatus
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    requiresAck?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticket?: TicketUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    ticketId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    requiresAck?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    ticketId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    requiresAck?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HelpRequestUpdateWithoutRequestedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    contextMessage?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    responses?: HelpRequestResponseUpdateManyWithoutHelpRequestNestedInput
  }

  export type HelpRequestUncheckedUpdateWithoutRequestedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    contextMessage?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    responses?: HelpRequestResponseUncheckedUpdateManyWithoutHelpRequestNestedInput
  }

  export type HelpRequestUncheckedUpdateManyWithoutRequestedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    contextMessage?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HelpRequestResponseUpdateWithoutResponderInput = {
    id?: StringFieldUpdateOperationsInput | string
    respondedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    helpRequest?: HelpRequestUpdateOneRequiredWithoutResponsesNestedInput
  }

  export type HelpRequestResponseUncheckedUpdateWithoutResponderInput = {
    id?: StringFieldUpdateOperationsInput | string
    helpRequestId?: StringFieldUpdateOperationsInput | string
    respondedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HelpRequestResponseUncheckedUpdateManyWithoutResponderInput = {
    id?: StringFieldUpdateOperationsInput | string
    helpRequestId?: StringFieldUpdateOperationsInput | string
    respondedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CheckpointUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentTask?: StringFieldUpdateOperationsInput | string
    isBlocked?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CheckpointUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentTask?: StringFieldUpdateOperationsInput | string
    isBlocked?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CheckpointUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentTask?: StringFieldUpdateOperationsInput | string
    isBlocked?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketEventCreateManyTicketInput = {
    id?: string
    eventType: $Enums.TicketEventType
    actorId: string
    metadata?: string
    createdAt?: Date | string
  }

  export type ReorderRequestCreateManyTicketInput = {
    id?: string
    requestedById: string
    requestedPosition: number
    reason?: string | null
    status?: $Enums.ReorderStatus
    resolvedById?: string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationCreateManyTicketInput = {
    id?: string
    userId: string
    type: $Enums.NotificationType
    title: string
    body: string
    isRead?: boolean
    requiresAck?: boolean
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type TicketEventUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: EnumTicketEventTypeFieldUpdateOperationsInput | $Enums.TicketEventType
    metadata?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    actor?: UserUpdateOneRequiredWithoutActorEventsNestedInput
  }

  export type TicketEventUncheckedUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: EnumTicketEventTypeFieldUpdateOperationsInput | $Enums.TicketEventType
    actorId?: StringFieldUpdateOperationsInput | string
    metadata?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketEventUncheckedUpdateManyWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: EnumTicketEventTypeFieldUpdateOperationsInput | $Enums.TicketEventType
    actorId?: StringFieldUpdateOperationsInput | string
    metadata?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReorderRequestUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedPosition?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReorderStatusFieldUpdateOperationsInput | $Enums.ReorderStatus
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: UserUpdateOneRequiredWithoutRequestedReordersNestedInput
    resolvedBy?: UserUpdateOneWithoutResolvedReordersNestedInput
  }

  export type ReorderRequestUncheckedUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedById?: StringFieldUpdateOperationsInput | string
    requestedPosition?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReorderStatusFieldUpdateOperationsInput | $Enums.ReorderStatus
    resolvedById?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReorderRequestUncheckedUpdateManyWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedById?: StringFieldUpdateOperationsInput | string
    requestedPosition?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReorderStatusFieldUpdateOperationsInput | $Enums.ReorderStatus
    resolvedById?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    requiresAck?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    requiresAck?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    requiresAck?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HelpRequestResponseCreateManyHelpRequestInput = {
    id?: string
    responderId: string
    respondedAt?: Date | string
  }

  export type HelpRequestResponseUpdateWithoutHelpRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    respondedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    responder?: UserUpdateOneRequiredWithoutHelpResponsesNestedInput
  }

  export type HelpRequestResponseUncheckedUpdateWithoutHelpRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    responderId?: StringFieldUpdateOperationsInput | string
    respondedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HelpRequestResponseUncheckedUpdateManyWithoutHelpRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    responderId?: StringFieldUpdateOperationsInput | string
    respondedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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