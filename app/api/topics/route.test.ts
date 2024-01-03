/**
 * @jest-environment node
 */
import { GET } from './route';
import { close } from '../../../lib/mongo';

it('responses a topic', async () => {
  const res = await GET(new Request("http://example.com/"));
  console.log(await res.json());
  close();
});
