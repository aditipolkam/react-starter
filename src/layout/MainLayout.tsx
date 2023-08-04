import React from 'react'
import Header from './Header'
import Footer from './Footer'

const MainLayout = ({children}:{children:JSX.Element}) => {
  return (
    <>
    <div>
      <title>React Starter</title>
      <meta
        name="description"
        content="React starter project with Tailwind CSS."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/qrate.png" />
    </div>
    <div className="min-h-screen flex flex-col justify-between">
      <main className="w-full py-10 lg:px-40 px-10">
        <Header />
        <div className="mt-20 flex-grow">{children}</div>
      </main>
      <Footer />
    </div>
  </>
  )
}

export default MainLayout