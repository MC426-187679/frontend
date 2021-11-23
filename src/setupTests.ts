/* eslint-disable import/no-extraneous-dependencies */

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import '@testing-library/react'
import '@testing-library/user-event'

import { mockMatchMedia, mockUseMediaQuery } from 'test/mediaQuery'

declare global {
    /** Coleção de mocks globais pela aplicação. */
    interface Mocks extends Record<string, jest.Mock | undefined> {}

    interface Window {
        /** Coleção de mocks globais pela aplicação. */
        mocks: Mocks
    }
}
// inicialização do objeto
window.mocks = {}

// prepara funções de match de CSS
mockMatchMedia({
    width: 1800,
    height: 800,
})
mockUseMediaQuery()
