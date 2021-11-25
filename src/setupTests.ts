/* eslint-disable import/no-extraneous-dependencies */

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import '@testing-library/react'
import '@testing-library/user-event'

import 'test/mediaQuery'

declare global {
    /** Coleção de mocks globais pela aplicação. */
    interface Mocks extends Record<string, jest.MockedFunction<any>> {}

    interface Window {
        /** Coleção de mocks globais pela aplicação. */
        mocks?: Mocks
    }
}
