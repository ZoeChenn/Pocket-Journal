import { useRouter } from 'next/router';
import React, { useState, useEffect } from "react"
import { UserAuth } from "../lib/AuthContext"

function LoginSection() {
  const { user, googleSignIn, logOut } = UserAuth()
  const [ loading, setLoading ] = useState(true)
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await googleSignIn()
      router.push('/myjournal');
    } catch (error) {
      console.log(error)
    }
  }

  const handleSignOut = async () => {
    try {
      await logOut()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
      setLoading(false)
    }
    checkAuthentication()
  }, [user])

  return (
    <div className='w-[250px] p-3 rounded-lg border-solid border-2 border-stone-100'>
      <div className="flex flex-row justify-center items-center">
        <img className="w-6 h-6 mr-2" src="/assets/images/icons/google-icon.svg" alt="" />
        <button className="font-medium" onClick={ handleSignIn }>
        login with google
      </button>
      </div>
    </div>
  );
}

export default LoginSection;