import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/repository/insert_composite_key', () => {
  class User extends Model {
    static entity = 'users'

    static primaryKey = ['idA', 'idB']

    @Attr() idA!: any
    @Attr() idB!: any
    @Str('') name!: string
  }

  it('inserts records with a composite key', () => {
    const userRepo = useRepo(User)

    userRepo.insert([
      { idA: 1, idB: 2, name: 'John Doe' },
      { idA: 2, idB: 1, name: 'Jane Doe' }
    ])

    assertState({
      users: {
        '[1,2]': { idA: 1, idB: 2, name: 'John Doe' },
        '[2,1]': { idA: 2, idB: 1, name: 'Jane Doe' }
      }
    })
  })

  it('throws if composite key is incomplete', () => {
    const userRepo = useRepo(User)

    expect(() => {
      userRepo.insert({ idA: 1, name: 'John Doe' })
    }).toThrow()
  })
})
