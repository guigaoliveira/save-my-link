import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Button, TextField, CircularProgress } from "@material-ui/core";
import { useMutation } from "@apollo/react-hooks";
import { GET_LINKS, CREATE_LINK } from "../../graphql";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      border: "1px solid #ccc",
      padding: theme.spacing(2),
      borderRadius: theme.spacing(0.5)
    },
    containerButton: {
      display: "flex",
      justifyContent: "flex-end"
    },
    button: {
      display: "block",
      marginTop: theme.spacing(1.5)
    },
    buttonProgress: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12
    },
    inputTags: {
      marginTop: theme.spacing(1.5)
    }
  })
);

const LinkForm: React.FC = () => {
  const classes = useStyles();

  const [link, setLink] = useState("");
  const [tags, setTags] = useState("");

  const [createLink, { loading, error }] = useMutation(CREATE_LINK, {
    update(cache, { data: { createLink } }) {
      const { links }: any = cache.readQuery({ query: GET_LINKS });
      cache.writeQuery({
        query: GET_LINKS,
        data: { links: [createLink, ...links] }
      });
    }
  });

  return (
    <>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
        onSubmit={e => {
          e.preventDefault();
          createLink({
            variables: {
              href: link,
              tags: tags ? tags.split(",").map(name => ({ name })) : []
            }
          });
        }}
      >
        <TextField
          label="Link"
          fullWidth
          variant="outlined"
          onChange={e => setLink(e.target.value)}
        />
        <TextField
          label="Tags"
          fullWidth
          variant="outlined"
          onChange={e => setTags(e.target.value)}
          className={classes.inputTags}
        />
        <div className={classes.containerButton}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            disableElevation
            type="submit"
            disabled={loading || link === ""}
          >
            Adicionar
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </Button>
        </div>
      </form>
      {error && <p>Error :( Please try again</p>}
    </>
  );
};

export default LinkForm;
