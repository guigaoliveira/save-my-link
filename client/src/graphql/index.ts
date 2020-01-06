import gql from "graphql-tag";

const linkFragment = gql`
  fragment LinkData on Link {
    id
    href
    faviconFileName
    tags {
      id
      name
    }
  }
`;

export const GET_LINKS = gql`
  {
    links {
      ...LinkData
    }
  }
  ${linkFragment}
`;

export const CREATE_LINK = gql`
  mutation CreateLink($href: String!, $tags: [CreateLinkTagsInput!]) {
    createLink(input: { href: $href, tags: $tags }) {
      ...LinkData
    }
  }
  ${linkFragment}
`;
