/* eslint-disable import/no-extraneous-dependencies */

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import '@testing-library/react'
import '@testing-library/user-event'

import { MediaValues, prepareMatchMedia } from 'test/mediaQuery'

const largeScreen: MediaValues = {
    width: 1800,
    height: 800,
}

// prepara para a inicialização global
prepareMatchMedia(largeScreen)
// e prepara para os testes
beforeEach(() => {
    prepareMatchMedia(largeScreen)
})
