import { ComponentPropsWithoutRef } from "react";
import { cn } from "../Utils/func";

const ChevronIcon = ({
  // size = '20px',
  color = "#000",
  isOpen = false,
  ...props
}: {
  size?: string;
  color?: string;
  isOpen?: boolean
} & ComponentPropsWithoutRef<"button">) => {
  return (
    <button {...props} className={cn(`${props.className}`,{"rotate-180" : !isOpen})}>
      <svg
        width={"100%"}
        height={"100%"}
        viewBox="0 -5 24 24"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        fill={color}
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <title>chevron-up</title> <desc>Created with Sketch Beta.</desc>{" "}
          <defs> </defs>{" "}
          <g
            id="Page-1"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            {" "}
            <g
              id="Icon-Set"
              transform="translate(-519.000000, -1200.000000)"
              fill={color}
            >
              {" "}
              <path
                d="M542.687,1212.29 L531.745,1200.31 C531.535,1200.1 531.258,1200.01 530.984,1200.03 C530.711,1200.01 530.434,1200.1 530.224,1200.31 L519.281,1212.29 C518.89,1212.69 518.89,1213.32 519.281,1213.72 C519.674,1214.11 520.31,1214.11 520.701,1213.72 L530.984,1202.46 L541.268,1213.72 C541.659,1214.11 542.295,1214.11 542.687,1213.72 C543.079,1213.32 543.079,1212.69 542.687,1212.29"
                id="chevron-up"
              >
                {" "}
              </path>{" "}
            </g>{" "}
          </g>{" "}
        </g>
      </svg>
    </button>
  );
};

export default ChevronIcon;
