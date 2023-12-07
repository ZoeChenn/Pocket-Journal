import React, { useEffect } from "react"
import { UserAuth } from "../lib/AuthContext"

function LoginSection() {
  const { user, googleSignIn } = UserAuth()

  const handleSignIn = async () => {
    try {
      await googleSignIn()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
    checkAuthentication()
  }, [user])

  return (
    <div className='px-10 py-3 rounded-lg bg-white border-solid border-2 border-stone-100 hover:bg-stone-100 cursor-pointer'>
      <div className="flex flex-row justify-center items-center">
        <img className="w-6 h-6 mr-2" src="/assets/images/icons/google-icon.svg" alt="" />
        <button className="font-light" onClick={ handleSignIn }>
        login with google
      </button>
      </div>
    </div>
  );
}

export default LoginSection;