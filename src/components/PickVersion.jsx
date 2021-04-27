import BrowserOnly from '@docusaurus/BrowserOnly'
import React from 'react'
import CodeBlock from '../theme/CodeBlock'
import { usePluginData } from '@docusaurus/useGlobalData'

export const usePickVersion = () => {
  const pathname = window.location.pathname

  let preferred = window.localStorage.getItem('docs-preferred-version-default')
  if (pathname === '/' && preferred) {
    return preferred === 'current' ? 'pulsar_version' : preferred
  }

  if (pathname.includes('/docs')) {
    return 'pulsar_version'
  }

  const { versions } = usePluginData('docusaurus-plugin-content-docs')
  const latestStableVersion = versions.filter((d) => d.isLast)[0].name
  const activeVersion = versions.filter((d) => pathname.includes(d.name)).map((d) => d.name)[0]

  return activeVersion || latestStableVersion
}

const PickVersion = ({ children, className }) => {
  const Result = ({ children }) => (
    <div>
      <CodeBlock className={className}>{children}</CodeBlock>
    </div>
  )

  return (
    <BrowserOnly fallback={<Result>{children}</Result>}>
      {() => {
        const { versions } = usePluginData('docusaurus-plugin-content-docs')
        const latestStableVersion = versions.filter((d) => d.isLast)[0].name
        // const activeVersion = versions.filter((d) => pathname.includes(d.name)).map((d) => d.name)[0]
        // const activeVersion = usePickVersion()
        const rendered = children.replace('pulsar_version', 'v' + latestStableVersion)

        return <Result>{rendered}</Result>
      }}
    </BrowserOnly>
  )
}
// const PickVersion = () => {
//   const { versions } = usePluginData('docusaurus-plugin-content-docs')
//   const latestStableVersion = versions.filter((d) => d.isLast)[0].name

//   console.log(latestStableVersion)
//   return <BrowserOnly fallback={<Result>{children}</Result>}>
//     {() => {
//       const version = usePickVersion()
//       const rendered = version === 'pulsar_version' ? children : children.replace('{{pulsar_version}}', 'v' + version)

//       return <Result>{rendered}</Result>
//     }}
//   </BrowserOnly>
// }

export default PickVersion