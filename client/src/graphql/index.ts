import gql from "graphql-tag";

const linkFragment = gql`
  fragment LinkData on Link {
    id
    href
    faviconFileName
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
  mutation CreateLink($href: String!) {
    createLink(input: { href: $href }) {
      ...LinkData
    }
  }
  ${linkFragment}
`;
