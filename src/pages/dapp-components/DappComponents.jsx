import React, { useState } from "react";

const DappComponents = () => {
  return (
    <section className="py-12  sm:py-16 lg:py-20 h-screen">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 font-pj">
            Reuseable Soroban dApp Components
          </h2>
        </div>

        <div className="relative mt-14">
          <div className="absolute -inset-2">
            <div
              className="w-full h-full max-w-4xl mx-auto opacity-30 blur-lg filter"
              style={{
                background:
                  "linear-gradient(90deg, #44ff9a -0.55%, #44b0ff 22.86%, #8b44ff 48.36%, #ff6644 73.33%, #ebff70 99.34%)",
              }}
            ></div>
          </div>

          <div className="relative grid max-w-4xl grid-cols-1 gap-5 mx-auto sm:gap-6 lg:gap-10 sm:grid-cols-2">
            <div className="bg-white shadow-xl rounded-xl">
              <div className="p-8 sm:py-10 sm:px-9">
                <div className="flex justify-start flex-shrink-0 -space-x-4 overflow-hidden">
                  <img
                    className="inline-block rounded-full w-14 h-14 ring-2 ring-white"
                    src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/3/avatar-male.png"
                    alt=""
                  />
                  <img
                    className="inline-block rounded-full w-14 h-14 ring-2 ring-white"
                    src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/3/avatar-female-1.png"
                    alt=""
                  />
                  <img
                    className="inline-block rounded-full w-14 h-14 ring-2 ring-white"
                    src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/3/avatar-female-2.png"
                    alt=""
                  />
                  <div className="inline-flex items-center justify-center bg-gray-100 rounded-full w-14 h-14 ring-2 ring-white">
                    <svg
                      className="w-5 h-5 text-gray-900"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 3C10.5523 3 11 3.44772 11 4V9H16C16.5523 9 17 9.44772 17 10C17 10.5523 16.5523 11 16 11H11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V11H4C3.44772 11 3 10.5523 3 10C3 9.44771 3.44772 9 4 9L9 9V4C9 3.44772 9.44772 3 10 3Z"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 font-pj mt-11">
                  Staking UI Component
                </h3>
                <p className="mt-3 text-base font-normal leading-7 text-gray-600">
                  Plug-and-play reusable staking and liquidity pool components
                  for Soroban dApp.
                </p>

                <a
                  href="mailto:info@sorobuild.io?subject=Demo%20Request%20Staking"
                  title=""
                  className="inline-flex items-center justify-center px-8 py-3 mt-8 text-base font-bold text-gray-900 transition-all duration-200 border-2 border-gray-400 rounded-xl font-pj hover:bg-gray-900 focus:bg-gray-900 hover:text-white focus:text-white hover:border-gray-900 focus:border-gray-900"
                  role="button"
                >
                  Request Demo
                </a>
              </div>
            </div>

            <div className="bg-white shadow-xl rounded-xl">
              <div className="p-8 sm:py-10 sm:px-9">
                <div className="flex items-center h-14">
                  <img
                    className="w-auto h-10"
                    src="https://cdn.rareblocks.xyz/collection/clarity/images/cta/1/logo-1.svg"
                    alt=""
                  />
                  <img
                    className="w-auto h-10 ml-3"
                    src="https://cdn.rareblocks.xyz/collection/clarity/images/cta/1/logo-2.svg"
                    alt=""
                  />
                  <img
                    className="w-auto h-10 ml-5"
                    src="https://cdn.rareblocks.xyz/collection/clarity/images/cta/1/logo-3.svg"
                    alt=""
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900 font-pj mt-11">
                  DAO Component
                </h3>
                <p className="mt-3 text-base font-normal leading-7 text-gray-600">
                  Plug and play reuseable staking and liquidity pool for Soroban
                  dApp components
                </p>

                <a
                  href="mailto:info@sorobuild.io?subject=Demo%20Request%20DAO"
                  title=""
                  className="inline-flex items-center justify-center px-8 py-3 mt-8 text-base font-bold text-gray-900 transition-all duration-200 border-2 border-gray-400 rounded-xl font-pj hover:bg-gray-900 focus:bg-gray-900 hover:text-white focus:text-white hover:border-gray-900 focus:border-gray-900"
                  role="button"
                >
                  Request Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DappComponents;
