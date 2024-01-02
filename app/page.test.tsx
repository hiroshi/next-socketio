import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils';

import Page from './page'

describe('Page', () => {
  it('renders a topic', async () => {
    global.fetch = jest.fn((url, opts) => {
      console.log(url, opts);
      return new Promise((resolve, reject) => {
        if (url === '/api/topics') {
          return resolve({json: () => new Promise((resolve) => resolve([{_id: '0'}]))});
        }
      });
    });

    // const heading = screen.getByRole('heading', { level: 1 })
    // expect(heading).toBeInTheDocument()
  })
})
