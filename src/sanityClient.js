import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'inw5d006',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2022-03-07',
  token: "sknZtteSnVZM6JjHdUPlPe0vWUr1WkmhDIvv2z8kE1gW5Lsics7S5GWyd5n2tEf99MRh7L3sxQtnMQWIcnMtGsLD5inYNzmiLCzAlv9r9GJTu4lIQxCi6IUqT9BgLGPASodQQOBXgTiDRvavWSo1CcV8NWRN9o75RY4gJdLA6oA4udfWAppJ",
  ignoreBrowserTokenWarning: true
})

export default client;