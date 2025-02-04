import React from 'react'
import { CiSearch } from "react-icons/ci";

const SideDrawer = () => {
  return (
    <div>
      <button class="btn btn-primary d-flex align-items-center justify-content-between" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
        <CiSearch />
        <span className='mx-2'>Search User</span>
      </button>

      <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasRightLabel">Users</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>   
        <div class="offcanvas-body">
          List of users 
        </div>
      </div>
    </div>
  )
}

export default SideDrawer
