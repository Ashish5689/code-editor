'use client';

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, CodeBracketIcon } from '@heroicons/react/20/solid';

export interface Language {
  id: string;
  name: string;
  value: string;
  extension: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageSelector = ({
  languages,
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-1">Language</label>
      <Listbox value={selectedLanguage} onChange={onLanguageChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg glass-dark py-2.5 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-sm border border-gray-700/30 transition-all hover:border-blue-500/50">
            <div className="flex items-center">
              <CodeBracketIcon className="h-4 w-4 mr-2 text-blue-400" />
              <span className="block truncate">{selectedLanguage.name}</span>
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md glass-dark py-1 text-base shadow-lg ring-1 ring-black/5 ring-opacity-5 focus:outline-none sm:text-sm backdrop-blur-lg border border-gray-700/30">
              {languages.map((language) => (
                <Listbox.Option
                  key={language.id}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white' : 'text-gray-200'
                    }`
                  }
                  value={language}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {language.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default LanguageSelector;
