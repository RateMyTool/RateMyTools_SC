import Link from 'next/link';

export default function SignUp() {
  return (
    <div
      className={[
        'min-h-screen',
        'flex',
        'items-center',
        'justify-center',
        'bg-gray-50',
      ].join(' ')}
    >
      <div
        className={[
          'max-w-md',
          'w-full',
          'space-y-8',
          'p-8',
          'bg-white',
          'rounded-lg',
          'shadow',
        ].join(' ')}
      >
        <div>
          <h2
            className={[
              'text-center',
              'text-3xl',
              'font-bold',
              'text-gray-900',
            ].join(' ')}
          >
            Create your account
          </h2>
        </div>
        <form className={['mt-8', 'space-y-6'].join(' ')}>
          <div className={['rounded-md', 'shadow-sm', 'space-y-4'].join(' ')}>
            <div>
              <input
                type="text"
                required
                className={[
                  'appearance-none',
                  'rounded-md',
                  'relative',
                  'block',
                  'w-full',
                  'px-3',
                  'py-2',
                  'border',
                  'border-gray-300',
                  'placeholder-gray-500',
                  'text-gray-900',
                  'focus:outline-none',
                  'focus:ring-indigo-500',
                  'focus:border-indigo-500',
                  'sm:text-sm',
                ].join(' ')}
                placeholder="Full name"
              />
            </div>
            <div>
              <input
                type="email"
                required
                className={[
                  'appearance-none',
                  'rounded-md',
                  'relative',
                  'block',
                  'w-full',
                  'px-3',
                  'py-2',
                  'border',
                  'border-gray-300',
                  'placeholder-gray-500',
                  'text-gray-900',
                  'focus:outline-none',
                  'focus:ring-indigo-500',
                  'focus:border-indigo-500',
                  'sm:text-sm',
                ].join(' ')}
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                required
                className={[
                  'appearance-none',
                  'rounded-md',
                  'relative',
                  'block',
                  'w-full',
                  'px-3',
                  'py-2',
                  'border',
                  'border-gray-300',
                  'placeholder-gray-500',
                  'text-gray-900',
                  'focus:outline-none',
                  'focus:ring-indigo-500',
                  'focus:border-indigo-500',
                  'sm:text-sm',
                ].join(' ')}
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className={[
                'group',
                'relative',
                'w-full',
                'flex',
                'justify-center',
                'py-2',
                'px-4',
                'border',
                'border-transparent',
                'text-sm',
                'font-medium',
                'rounded-md',
                'text-white',
                'bg-black',
                'hover:bg-gray-800',
                'focus:outline-none',
                'focus:ring-2',
                'focus:ring-offset-2',
                'focus:ring-indigo-500',
              ].join(' ')}
            >
              Sign up
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link
            href="/auth/signin"
            className="text-blue-600 hover:text-blue-500"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
