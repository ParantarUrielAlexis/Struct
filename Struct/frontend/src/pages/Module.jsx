import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaPlay, FaBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const lessons = [
  { id: 1, title: "Basic Definition of Arrays" },
  { id: 2, title: "Indexing and Modifying" },
  { id: 3, title: "Static Arrays" },
  { id: 4, title: "Dynamic Arrays" },
  { id: 5, title: "Multidimensional Arrays" },
  { id: 6, title: "Basic Sorting Algorithms" },
];

const Module = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleTypingTestRedirect = () => {
    navigate("/type-test"); // Redirect to Typing Test page
  };

  const handleSortingRedirect = () => {
    navigate("/sortshift"); // Redirect to Typing Test page
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-md pt-20">
        <ul className="p-4 space-y-4">
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg shadow-sm hover:bg-blue-100 cursor-pointer"
            >
              <div className="flex items-center">
                <FaBook className="text-blue-500 mr-2" />
                {/* Show full title on larger screens, only "Lesson X" on smaller screens */}
                <h3 className="text-sm font-semibold text-gray-700">
                  <span className="block sm:hidden">Lesson {lesson.id}</span>
                  <span className="hidden sm:block">
                    Lesson {lesson.id}: {lesson.title}
                  </span>
                </h3>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 pt-20">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Learn about Arrays
          </h1>
          <p className="text-sm text-blue-600">Basic Definitions of Arrays</p>
        </div>

        {/* Recap Section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Recap of Arrays
          </h2>
          <p className="mt-2 text-gray-600">
            An array is a data structure that stores a collection of elements,
            typically of the same data type, in a contiguous block of memory.
            Arrays are used when:
          </p>
          <ul className="mt-2 ml-4 list-disc text-gray-600">
            <li>You want to store multiple values under one name.</li>
            <li>You need fast access to elements by index man.</li>
            <li>
              You want to perform operations over collections of values (e.g.,
              sums, searches, sorts).
            </li>
          </ul>
        </section>

        {/* Key Characteristics Section */}
        <section className="mb-6 bg-blue-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Key Characteristics of an Array
          </h2>
          <p className="mt-2 text-gray-600">
            Like socks in a drawer—organized, matching, and easy to find!
          </p>
          <ul className="mt-2 ml-4 list-disc text-gray-600">
            <li>
              Fixed Size: Once you decide how many elements you want, you're
              (usually) stuck with it.
            </li>
            <li>
              Indexed: Each item has an address (starting from 0), like
              apartments in a building.
            </li>
            <li>
              Homogeneous: All elements are of the same type—no mixing socks
              with shoes!
            </li>
          </ul>
        </section>

        {/* Common Operations Section */}
        <section className="mb-6 bg-red-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Common Operations
          </h2>
          <p className="mt-2 text-gray-600">Simple moves, powerful outcomes.</p>
          <p className="mt-2 text-gray-600">
            Once an array is declared and initialized, there are several common
            operations you'll often perform. The most frequent is accessing
            elements using the index. In C++, you access the third element of an
            array using
            <code> arr[2]</code> (since indexing starts at 0). You can also
            modify an element directly:
            <code> arr[1] = 10</code> sets the second item to 10.
          </p>
        </section>

        {/* Code Section */}
        <section className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">Try the Code!</h2>
          <p className="mt-2 text-gray-600">
            Use the embedded editor below to experiment with the code:
          </p>
          <div
            className="mt-4 rounded-lg border border-gray-300"
            style={{
              width: "100%",
              height: "1000px", // Increased height to show more content
              overflow: "hidden", // Prevent parent container from scrolling
            }}
          >
            <iframe
              src="https://paiza.io/projects/e/vBuj24nZhWzDYWHr6Le1mg?theme=twilight"
              width="100%"
              height="1000px" // Match the parent container height
              className="rounded-lg"
              style={{
                display: "block",
              }}
            ></iframe>
          </div>
        </section>

        {/* Play to Learn Section */}
        <section className="p-4 rounded-lg shadow-sm bg-teal-400">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={toggleDropdown}
          >
            <h2 className="text-xl font-semibold text-white">Play to Learn!</h2>
            <span className="text-white">
              {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          {isDropdownOpen && (
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
                <p className="text-gray-600">Typing Test Game</p>
                <button
                  onClick={handleTypingTestRedirect}
                  className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600"
                >
                  <FaPlay />
                </button>
              </div>

              <div className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
                <p className="text-gray-600">Sorting Game</p>
                <button
                  onClick={handleSortingRedirect}
                  className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600"
                >
                  <FaPlay />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Module;
