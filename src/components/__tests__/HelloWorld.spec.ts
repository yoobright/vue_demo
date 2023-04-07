import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HelloWorld from '../HelloWorld.vue'
import _ from 'lodash'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(HelloWorld, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})


function getObjectDiff(obj1: any, obj2: any) {
  const diff = Object.keys(obj1).reduce((result, key) => {
      // eslint-disable-next-line no-prototype-builtins
      if (!obj2.hasOwnProperty(key)) {
          result.push(key);
      } else if (_.isEqual(obj1[key], obj2[key])) {
          const resultKeyIndex = result.indexOf(key);
          result.splice(resultKeyIndex, 1);
      }
      return result;
  }, Object.keys(obj2));

  return diff;
}



describe('test', () => {

  it('test demo', () => {
    const a = {
      name: 'test',
      age: 18,
      foo: 'bar',
      id: [2, 3, 4, 6]
    }
    const b = {
      name: 'test2',
      age: 18,
      id: [2, 3, 5]
    }
    // const wrapper = mount(HelloWorld, { props: { msg: 'Hello Vitest' } })
    // expect(wrapper.text()).toContain('Hello Vitest')
    const out = getObjectDiff(b, a)
    expect(out).toEqual(['name', 'foo', 'id',])
  })
})
