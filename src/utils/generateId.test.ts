import uuid from 'uuid/v1'
import generateId from './generateId'
import mockOf from '../../test/utils/mockOf'

jest.mock('uuid/v1')

const uuidMock = mockOf(uuid)

test('calls through to uuid/v1', () => {
  uuidMock.mockReturnValue('abcd')
  expect(generateId()).toEqual('abcd')
  expect(uuidMock).toHaveBeenCalledWith()
})
