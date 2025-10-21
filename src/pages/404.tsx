import { Flex, Heading, Text } from '@chakra-ui/react';

import { PageProvider } from '@/providers/PageProvider';

function PageNotFound() {
  return (
    <PageProvider>
      <Flex
        flexDir='column'
        flex={1}
        justifyContent='center'
        alignItems='center'>
        <Heading
          as='h1'
          fontSize={{ base: '32px', md: '42px' }}
          color='brandPrimary.900'>
          404
        </Heading>
        <Text fontSize={{ base: '16px', md: '20px' }}>Not Found</Text>
      </Flex>
    </PageProvider>
  );
}

export { PageNotFound };
