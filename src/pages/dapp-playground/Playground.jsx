import React, { useState } from "react";
import { Copy, DocumentDownload, Code, Setting2 } from "iconsax-react";

export default function Playground() {
  return (
    <section className="py-12  sm:py-16 lg:py-20 h-screen">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="md:flex md:items-end md:justify-between">
          <div className="sm:max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Soroban Playground
            </h1>
            <p className="mt-4 text-base font-normal leading-7 text-gray-600">
              Customize and simulate your smart contracts while building.
            </p>
          </div>
        </div>

        <div className="md:flex md:items-end md:justify-between mt-5">
          <div className="flex gap-4">
            <button
              type="button"
              className="items-center justify-center hidden px-4 py-2 gap-2 text-sm font-bold text-gray-100 transition-all duration-200 border border-gray-300  bg-gray-500 rounded-md md:inline-flex  hover:text-gray-900 focus:outline-none"
            >
              SEP-41
            </button>
            <button
              type="button"
              className="items-center justify-center hidden px-4 py- gap-2 text-sm font-bold text-gray-700 transition-all duration-200  rounded-md md:inline-flex hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
            >
              SAC
            </button>

            <button
              type="button"
              className="items-center justify-center hidden gap-2 px-4 py-2 text-sm font-bold text-gray-700 transition-all duration-200  rounded-md md:inline-flex hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
            >
              DAO
            </button>
            <button
              type="button"
              className="items-center justify-center hidden gap-2 px-4 py-2 text-sm font-bold text-gray-700 transition-all duration-200  rounded-md md:inline-flex hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
            >
              Custom
            </button>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              className="items-center justify-center hidden px-4 py-2 gap-2 text-sm font-bold text-gray-700 transition-all duration-200 border border-gray-300 rounded-md md:inline-flex hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
            >
              <Copy size="20" color="#697689" />
              Copy to Clipboard
            </button>
            <button
              type="button"
              className="items-center justify-center hidden px-4 py- gap-2 text-sm font-bold text-gray-700 transition-all duration-200 border border-gray-300 rounded-md md:inline-flex hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
            >
              <Code size="20" color="#697689" />
              Open in IDE
            </button>

            <button
              type="button"
              className="items-center justify-center hidden gap-2 px-4 py-2 text-sm font-bold text-gray-700 transition-all duration-200 border border-gray-300 rounded-md md:inline-flex hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
            >
              <DocumentDownload size="20" color="#697689" />
              Download
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 mt-6 md:mt-10 lg:grid-cols-4 gap-x-8 gap-y-10">
          <div className="hidden space-y-8 lg:block">
            <button
              type="button"
              className="inline-flex items-center p-1 -m-1 gap-2 text-base font-bold text-gray-900 transition-all duration-200 focus:outline-none group"
            >
              <Setting2 size="20" color="#697689" />
              Settings
            </button>

            <hr className="mt-5 border-gray-200" />

            <div className="flow-root mt-5">
              <div className="-my-6 divide-y divide-gray-200">
                <div className="py-6 space-y-7">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-1 -m-1 text-base font-bold text-gray-900 transition-all duration-200 group focus:outline-none"
                  >
                    Category
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-900"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          className="w-5 h-5 text-gray-900 border-gray-300 rounded-sm focus:ring-gray-900"
                          checked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor=""
                          className="text-sm font-medium text-gray-700"
                        >
                          {" "}
                          Admin Template{" "}
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          className="w-5 h-5 text-gray-900 border-gray-300 rounded-sm focus:ring-gray-900"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor=""
                          className="text-sm font-medium text-gray-700"
                        >
                          {" "}
                          SaaS UI Kit{" "}
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          className="w-5 h-5 text-gray-900 border-gray-300 rounded-sm focus:ring-gray-900"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          // for=""
                          className="text-sm font-medium text-gray-700"
                        >
                          {" "}
                          Landing UI Kit{" "}
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          className="w-5 h-5 text-gray-900 border-gray-300 rounded-sm focus:ring-gray-900"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          // for=""
                          className="text-sm font-medium text-gray-700"
                        >
                          {" "}
                          Blog UI Kit{" "}
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          className="w-5 h-5 text-gray-900 border-gray-300 rounded-sm focus:ring-gray-900"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          // for=""
                          className="text-sm font-medium text-gray-700"
                        >
                          {" "}
                          Ecommerce UI Kit{" "}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-6 space-y-7">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-1 -m-1 text-base font-bold text-gray-900 transition-all duration-200 group focus:outline-none"
                  >
                    Compatible With
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-900"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                <div className="py-6 space-y-7">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-1 -m-1 text-base font-bold text-gray-900 transition-all duration-200 group focus:outline-none"
                  >
                    Software Version
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-900"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                <div className="py-6 space-y-7">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-1 -m-1 text-base font-bold text-gray-900 transition-all duration-200 group focus:outline-none"
                  >
                    Price
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-900"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                <div className="py-6 space-y-7">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-1 -m-1 text-base font-bold text-gray-900 transition-all duration-200 group focus:outline-none"
                  >
                    Date Added
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-900"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-[#282B34] border-2  rounded-md h-96 lg:h-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
