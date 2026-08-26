import React from "react";
import { MdEmail, MdOutlineTaskAlt } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import ColorButton from "../../components/common/Button";

const Login = () => {
    return (
        <header className="h-screen w-full flex overflow-hidden">
            <div className="hidden lg:flex w-1/2 relative bg-surface-container-low flex-col justify-between p-12 overflow-hidden border-r border-outline-variant">
              {/* <!-- Background Image overlay --> */}
             <div className="absolute inset-0 z-0">
             <div className="bg-cover bg-center w-full h-full opacity-60 mix-blend-multiply" data-alt="A bright, modern corporate office environment focusing on productivity and task management. Clean lines, natural light pouring in through large windows, and subtle digital interfaces hovering in the background. The aesthetic is 'Professional Utility' in light mode, featuring a palette of crisp whites, soft grays, and precise touches of deep blue. The mood is calm, organized, and highly efficient."></div>
                <div className="absolute inset-0 bg-gradient-to-b from-surface-container-low/40 to-surface-container-low/90"></div>
             </div>
            <div className="relative z-10 flex items-center gap-2">
             <span className="material-symbols-outlined icon-filled text-primary text-3xl"><MdOutlineTaskAlt /></span>
             <span className="font-headline-sm text-headline-sm font-black text-primary">TaskMaster Pro</span>
            </div>
            <div className="relative z-10 max-w-lg pb-12">
             <h1 className="font-display-lg text-display-lg text-on-surface mb-6">Hệ thống quản lý công việc chuyên nghiệp.</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
                Được thiết kế cho các nhóm hiệu suất cao. Theo dõi tiến độ, quản lý phân quyền và đạt được mục tiêu một cách có cấu trúc và hiệu quả.
            </p>
          </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-surface-container-lowest p-8 sm:p-12 md:p-container_margin relative">
               <div className="w-full max-w-[420px] flex flex-col gap-8">
                {/* <!-- Header --> */}
                   <div className="flex flex-col gap-2 text-center lg:text-left">
                     <h2 className="font-headline-md text-headline-md text-on-surface">Đăng nhập vào hệ thống</h2>
                   </div>
                {/* <!-- Form --> */}
               <form className="flex flex-col gap-6">
           <div className="flex flex-col gap-4">
          {/* <!-- Email Field --> */}
         <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-label-md text-on-surface" >Email công việc</label>
           <div className="relative">
           <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm"><MdEmail/></span>
          <input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors" id="email" name="email" placeholder="name@company.com" />
           </div>
             </div>
              {/* <!-- Password Field --> */}
               <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface">Mật khẩu</label>
               <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm"><CiLock /></span>
                <input className="w-full pl-10 pr-10 py-2 bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors" id="password" name="password" placeholder="••••••••"/>
               <button className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface flex items-center justify-center" type="button">
                <span className="material-symbols-outlined text-sm"><FaEyeSlash/></span>
               </button>
                </div>
                 </div>
                  </div>
                  {/* <!-- Remember & Forgot --> */}
                <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                 <div className="relative flex items-center justify-center">
                 <input className="peer appearance-none w-4 h-4 border border-outline-variant rounded-sm bg-surface-container-lowest checked:bg-primary checked:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors" type="checkbox"/>
                  <span className="material-symbols-outlined absolute text-[12px] text-on-primary opacity-0 peer-checked:opacity-100 pointer-events-none"><FaCheck/></span>
                  </div>
                  <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">Ghi nhớ đăng nhập</span>
                   </label>
                    <a className="font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant transition-colors underline-offset-2 hover:underline" href="#">
                        Quên mật khẩu?
                    </a>
                </div>
               <ColorButton color="primary" size="large" onClick={() => console.log("Login button clicked")}>
                  Đăng nhập hệ thống
                </ColorButton>   
               </form>
               </div>          
            </div>
      </header>
    )}
  export default Login; 

