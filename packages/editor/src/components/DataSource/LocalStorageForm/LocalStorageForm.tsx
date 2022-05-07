import React, { useState, useEffect } from 'react';
import { VStack, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { ComponentSchema } from '@sunmao-ui/core';
import { EditorServices } from '../../../types';
import { genOperation } from '../../../operations';
import { Type } from '@sinclair/typebox';
import { SpecWidget } from '@sunmao-ui/editor-sdk';

interface Values {
  key: string;
  initialValue: string;
}
interface Props {
  state: ComponentSchema;
  services: EditorServices;
}

export const LocalStorageForm: React.FC<Props> = props => {
  const { state, services } = props;
  const [name, setName] = useState(state.id);
  const { registry, eventBus, editorStore } = services;
  const traitIndex = state.traits.findIndex(
    ({ type }) => type === 'core/v1/localStorage'
  );
  const trait = state.traits[traitIndex];
  const formik = useFormik<Values>({
    initialValues: {
      key: 'initialValue',
      initialValue: trait.properties.initialValue as string,
    },
    onSubmit: values => {
      eventBus.send(
        'operation',
        genOperation(registry, 'modifyTraitProperty', {
          componentId: state.id,
          traitIndex: traitIndex,
          properties: values,
        })
      );
    },
  });
  const { values } = formik;

  const onNameInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value) {
      if (value !== state.id) {
        editorStore.changeDataSourceName(state, name);
      }
    }
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    // prevent form keyboard events to accidentally trigger operation shortcut
    e.stopPropagation();
  };

  useEffect(() => {
    formik.setValues({
      key: 'initialValue',
      initialValue: (trait.properties.initialValue as string) ?? '',
    });
  }, [trait.properties, state.id]);
  useEffect(() => {
    if (state.id) {
      setName(state.id);
      formik.handleSubmit();
    }
  }, [state.id]);

  return (
    <VStack p="2" spacing="2" background="gray.50" onKeyDown={onKeyDown}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
          onBlur={onNameInputBlur}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Initial Value</FormLabel>
        <SpecWidget
          spec={Type.Any()}
          value={values.initialValue}
          component={state}
          level={1}
          path={['initialValue']}
          services={services}
          onChange={value => {
            formik.setFieldValue('initialValue', value);
            formik.handleSubmit();
          }}
        />
      </FormControl>
    </VStack>
  );
};