import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Grid,
  List,
  ListItem,
  Typography,
  CircularProgress,
  Link
} from "@material-ui/core";
import { useQuery } from "@apollo/react-hooks";
import LinkOffIcon from "@material-ui/icons/LinkOff";
import { GET_LINKS } from "../../graphql";

interface Link {
  id: number;
  href: string;
  faviconFileName: string;
}

interface LinkData {
  links: Link[];
}

interface CentralizedGridProps {
  className: string;
  children: React.ReactNode;
}

interface LinkListItemProps {
  data: Link;
}

const CentralizedGrid: React.FC<CentralizedGridProps> = ({
  className,
  children
}) => (
  <Grid
    container
    justify="center"
    alignItems="center"
    direction="column"
    className={className}
  >
    {children}
  </Grid>
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      border: "1px solid #ccc",
      padding: theme.spacing(2),
      borderRadius: theme.spacing(0.5),
      marginTop: theme.spacing(2),
      wordBreak: "break-all"
    },
    icon: {
      marginRight: theme.spacing(1)
    }
  })
);

const LinkListItem: React.FC<LinkListItemProps> = ({ data }) => {
  const classes = useStyles();
  return (
    <ListItem disableGutters>
      {data.faviconFileName ? (
        <img
          src={
            process.env.REACT_APP_SERVER_HOST +
            "/" +
            process.env.REACT_APP_FAVICONS_PATH +
            "/" +
            data.faviconFileName
          }
          alt=""
          className={classes.icon}
          width={16}
          height={16}
        />
      ) : (
        <LinkOffIcon className={classes.icon} style={{ fontSize: 16 }} />
      )}
      <Typography>
        <Link href={data.href} target="_blank" rel="noreferrer">
          {data.href}
        </Link>
      </Typography>
    </ListItem>
  );
};

const LinkList: React.FC = () => {
  const classes = useStyles();

  const { loading, error, data } = useQuery<LinkData>(GET_LINKS);

  if (loading) {
    return (
      <CentralizedGrid className={classes.grid}>
        <CircularProgress />
      </CentralizedGrid>
    );
  }

  if (error) {
    return (
      <CentralizedGrid
        className={classes.grid}
      >{`Error! ${error.message}`}</CentralizedGrid>
    );
  }

  return (
    <>
      {data && !data.links.length && (
        <CentralizedGrid className={classes.grid}>
          <Typography variant="body1">Sem links para exibir.</Typography>
          <Typography variant="body2">
            Quando você guardar um link ele será exibido aqui.
          </Typography>
        </CentralizedGrid>
      )}
      {data && !!data.links.length && (
        <Grid className={classes.grid}>
          <Typography variant="h6" gutterBottom>
            Seus links
          </Typography>
          <List>
            {data.links.map(link => (
              <LinkListItem key={link.id} data={link} />
            ))}
          </List>
        </Grid>
      )}
    </>
  );
};

export default LinkList;
