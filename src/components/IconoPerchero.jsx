export default function IconoPerchero({ tamano = 28, className = '' }) {
  return (
    <svg
      className={className}
      width={tamano}
      height={tamano}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M32 24v-5a6 6 0 1 0-6-6" />
      <path d="M32 24 9 43a3 3 0 0 0 2 5.5h42a3 3 0 0 0 2-5.5z" />
      <path d="M32 44c-4.5-3-7-5.2-7-8a3.8 3.8 0 0 1 7-1.8 3.8 3.8 0 0 1 7 1.8c0 2.8-2.5 5-7 8z" />
    </svg>
  )
}
