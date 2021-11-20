import type { Timeout } from './types/timeout'
import type { Message } from './types/message'
import { Errors, useErrors } from './providers/errors'
import ErrorsDisplay from './components/ErrorsDisplay'
import SendError from './components/SendError'

export type { Message, Timeout }
export { ErrorsDisplay, Errors, SendError, useErrors }
export default ErrorsDisplay
