import Home from './(app)/home/page';
import Applayout from './(app)/layout';
import React from 'react';
import PropTypes from 'prop-types';

function Page() {
  return (
    <div>
      <Applayout>
        <Home />
      </Applayout>
    </div>
  )
}

Page.propTypes = {
  children: PropTypes.node
};

export default Page;