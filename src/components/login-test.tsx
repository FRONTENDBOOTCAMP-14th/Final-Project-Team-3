'use client'

import supabase from '../libs/supabase'

function LoginTestButton() {
  // const signInGoogle = async () => {
  //   await supabase.auth.signInWithOAuth({
  //     provider: 'google',
  //   })
  // }

  const signInKakao = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div>
      <button onClick={signInKakao}>로그인</button>
      <button onClick={signOut}>로그아웃</button>
    </div>
  )
}

export default LoginTestButton
