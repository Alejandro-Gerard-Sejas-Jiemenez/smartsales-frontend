
import { useState, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { FaCheck, FaChevronDown } from 'react-icons/fa'; // (O los iconos que prefieras)

/**
 * Un componente de dropdown (select) que permite al usuario escribir para buscar.
 *
 * Props:
 * - items: Array de objetos. CADA objeto debe tener { id, name }.
 * - value: El objeto seleccionado actualmente (ej. { id: 1, name: 'Yordan' }) o null.
 * - onChange: Función que se llama con el objeto seleccionado.
 * - placeholder: Texto a mostrar cuando no hay nada seleccionado.
 */
export default function SearchableDropdown({ items, value, onChange, placeholder = "Seleccione..." }) {
  const [query, setQuery] = useState('');

  // Filtra los items basado en lo que el usuario escribe
  const filteredItems =
    query === ''
      ? items
      : items.filter((item) =>
          item.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <Combobox value={value} onChange={onChange}>
      <div className="relative">
        <div className="input-base relative w-full cursor-default overflow-hidden text-left focus:outline-none sm:text-sm p-0">
          <Combobox.Input
            className="w-full border-none py-2.5 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            displayValue={(item) => item?.name || ''}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <FaChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredItems.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                No se encontró nada.
              </div>
            ) : (
              filteredItems.map((item) => (
                <Combobox.Option
                  key={item.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                    }`
                  }
                  value={item}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {item.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-indigo-600'
                          }`}
                        >
                          <FaCheck className="h-4 w-4" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}