import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 910px;
  width: 100%;
  background: ${({ theme }) => "transparent"};
  border: 1px solid rgba(243,244,248,0.1);
  border-radius: 20px;
  padding: 1rem 60px;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
