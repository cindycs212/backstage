/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { lazy } from 'react';
import {
  AnyExtensionInputMap,
  ExtensionBoundary,
  PortableSchema,
  coreExtensionData,
  createExtension,
} from '@backstage/frontend-plugin-api';

/** @alpha */
export function createCatalogFilterExtension<
  TInputs extends AnyExtensionInputMap,
  TConfig = never,
>(options: {
  id: string;
  inputs?: TInputs;
  configSchema?: PortableSchema<TConfig>;
  loader: (options: { config: TConfig }) => Promise<JSX.Element>;
}) {
  const id = `catalog.filter.${options.id}`;

  return createExtension({
    id,
    attachTo: { id: 'plugin.catalog.page.index', input: 'filters' },
    inputs: options.inputs ?? {},
    configSchema: options.configSchema,
    output: {
      element: coreExtensionData.reactElement,
    },
    factory({ bind, config, source }) {
      const ExtensionComponent = lazy(() =>
        options
          .loader({ config })
          .then(element => ({ default: () => element })),
      );

      bind({
        element: (
          <ExtensionBoundary id={id} source={source}>
            <ExtensionComponent />
          </ExtensionBoundary>
        ),
      });
    },
  });
}
