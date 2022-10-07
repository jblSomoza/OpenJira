import { Box } from '@mui/material'
import Head from 'next/head'
import React, { FC } from 'react'
import { Navbar, Sidebar } from '../ui';

interface Props {
    title?: string;
    children: JSX.Element | JSX.Element[]
}

export const Layout:FC<Props> = ({ title = 'OpenJira', children}) => {
  return (
    <Box sx={{ flexFlow: 1 }}>
        <Head>
            <title>{ title }</title>
        </Head>
        
        <Navbar />
        <Sidebar />

        <Box sx={{ paddingTop:'10px 20px' }}>
            { children }
        </Box>
    </Box>
  )
}
