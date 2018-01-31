import React from 'react'
import { Layout } from 'antd'
import bkg from '../bkg.jpg'

import Converter from './Converter'
import TopCurrency from './TopCurrency'

const { Header, Content } = Layout

class Home extends React.Component {
  render() {
    return (
      <Layout
        className="layout"
        style={{ minHeight: '100vh', backgroundImage: `url(${bkg})` }}
      >
        <Header
          style={{
            background: '#537791',
            height: 'auto',
            minHeight: '54px',
            lineHeight: '54px',
            padding: '0 25px',
          }}
        >
          <h1 style={{ color: '#fff', float: 'left', marginBottom: '0' }}>
            Convertis
          </h1>
        </Header>
        <Content>
          <div style={{ padding: '25px 25px 8px 25px' }}>
            <Converter />
            <TopCurrency />
          </div>
        </Content>
      </Layout>
    )
  }
}

export default Home
