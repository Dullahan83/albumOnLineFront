import React, {ComponentPropsWithoutRef} from 'react'

const ArrowIconRight = ({
   size = '20px',
   color = '#000',
   ...props
}: {
   size?: string
   color?: string
} & ComponentPropsWithoutRef<'button'>) => {
   return (
    <button {...props} aria-label='go to next picture'>
        <svg
            height={size}
            width={size}
            version="1.1"
            id="_x32_"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill={color}
            transform="rotate(180)"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
                {' '}
                <style type="text/css"> </style>{' '}
                <g>
                {' '}
                <path d="M426.231,121.22h-63.754c6.586-30.688-5.665-62.058-31.498-80.214c-13.206-9.296-28.771-14.228-44.959-14.228 c-15.071,0-29.726,4.32-42.395,12.49l-1.337,0.87l-1.295,0.928L33.194,191.074C12.38,206.146,0,230.402,0,256.004 c0,25.594,12.38,49.85,33.126,64.87l207.867,150.06l1.295,0.928l1.337,0.869c12.67,8.17,27.324,12.49,42.395,12.49 c16.196,0,31.753-4.925,44.993-14.254c25.756-18.105,38.015-49.441,31.464-80.181h63.754c47.294,0,85.769-38.475,85.769-85.769 v-98.038C512,159.696,473.525,121.22,426.231,121.22z M450.93,305.019c0,13.641-11.058,24.699-24.699,24.699H285.509l17.159,73.441 c1.584,6.799-1.099,13.862-6.808,17.874c-2.948,2.079-6.39,3.119-9.84,3.119c-3.22,0-6.45-0.912-9.278-2.735L68.943,271.408 c-4.942-3.578-7.873-9.304-7.873-15.404c0-6.1,2.931-11.834,7.873-15.412L276.742,90.583c2.828-1.823,6.058-2.735,9.278-2.735 c3.45,0,6.892,1.048,9.84,3.118c5.708,4.013,8.401,11.084,6.808,17.866l-17.159,73.458h140.722c13.64,0,24.699,11.05,24.699,24.691 V305.019z"></path>{' '}
                </g>{' '}
            </g>
        </svg>
    </button>
   )
}

export default ArrowIconRight
