import { Converter } from '../socket';
import { actions } from '../features/Messages/redux';

const { ioMessage } = actions;

export const IOMessageToAction: Converter<any> = (data: any) => {
  return ioMessage(data.message);
};
