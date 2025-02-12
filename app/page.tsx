import Home from './(app)/home/page';
import Applayout from './(app)/layout';
import React from 'react'

function Page() {
  return (
    <div>
     <Applayout children={<Home/>}/>
    </div>
  )
}

export default Page