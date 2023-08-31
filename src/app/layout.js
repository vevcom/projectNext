import { Inter } from 'next/font/google'
import Head from 'next/head'
import { v4 as uuid } from 'uuid'

import '../styles/omega-style.scss'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'projectnext',
  description: '',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta key={uuid()} charset="utf-8" />
        <meta key={uuid()} http-equiv="x-ua-compatible" content="ie=edge" />
        <meta key={uuid()} name="viewport" content="width=device-width, initial-scale=1" />

        <meta key={uuid()} property="og:title" content="Sanctus Omega Broderskab" />
        <meta key={uuid()} property="og:image" content="../images/Omegamai.jpeg" />
        <meta key={uuid()} property="og:description" content="Linjeforeningen for Elektronisk Systemdesign og Innovasjon (MTELSYS) og Kybernetikk og Robotikk (MTTK) ved Norges Tekniske-Naturvitenskapelige Universitet (NTNU)" />
        <meta key={uuid()} property="twitter:title" content="Sanctus Omega Broderskab" />
        <meta key={uuid()} property="twitter:image" content="../images/Omegamai.jpeg" />
        <meta key={uuid()} property="twitter:description" content="Linjeforeningen for Elektronisk Systemdesign og Innovasjon (MTELSYS) og Kybernetikk og Robotikk (MTTK) ved Norges Tekniske-Naturvitenskapelige Universitet (NTNU)" />
      </Head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
