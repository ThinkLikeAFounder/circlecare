import { StarIcon } from '@heroicons/react/20/solid';

const testimonials = [
  {
    name: 'Alice Johnson',
    role: 'Community Organizer',
    quote: 'CircleCare made managing our community fund transparent and fair. The settlement process is so much easier now!',
    avatar: '/avatars/alice.jpg',
    rating: 5,
  },
  {
    name: 'David Chen',
    role: 'Treasurer, Local Club',
    quote: 'The time-based expiration feature ensures our funds are always managed responsibly. Highly recommended!',
    avatar: '/avatars/david.jpg',
    rating: 5,
  },
  {
    name: 'Maria Garcia',
    role: 'Event Coordinator',
    quote: 'The Clarity 4 integration gives us peace of mind knowing our transactions are secure and verifiable.',
    avatar: '/avatars/maria.jpg',
    rating: 4,
  },
  {
    name: 'James Wilson',
    role: 'Non-profit Director',
    quote: 'CircleCare has transformed how we handle donations and expenses. The transparency is unmatched.',
    avatar: '/avatars/james.jpg',
    rating: 5,
  },
  {
    name: 'Sarah Kim',
    role: 'Community Leader',
    quote: 'The restrict-assets feature ensures that funds are only used for their intended purpose. Game changer!',
    avatar: '/avatars/sarah.jpg',
    rating: 5,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function Testimonials() {
  return (
    <section className="py-16 bg-white" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Trusted by Community Leaders
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            See what people are saying about CircleCare
          </p>
        </div>

        <div className="mt-16 space-y-16 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="bg-gray-50 p-8 rounded-lg h-full">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={testimonial.avatar}
                    alt={`${testimonial.name} avatar`}
                  />
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          testimonial.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                          'h-5 w-5 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="text-base font-medium text-gray-900 mt-1">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="mt-4 text-base text-gray-600">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-base font-medium text-gray-500">
            Join {testimonials.length * 42}+ community leaders using CircleCare
          </p>
          <div className="mt-6">
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Get Started
              <svg
                className="ml-3 -mr-1 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
