import React, { Fragment } from "react"
import { connect } from 'react-redux'
import AddSection from './AddSection'
import RemoveSection from './RemoveSection'
import { removeSection, toggleSection } from '../../actions/sectionActions'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import DeleteSweepIcon from 'mdi-react/DeleteSweepIcon'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Loading from '../Loading';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';

const mapStateToProps = ({ sections }) => {
  return {
    sections: sections
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleClickRemoveSection: (section) => {
      dispatch(removeSection(section))
    },
    handleClickToggleSection: (section) => {
      dispatch(toggleSection(section))
    },
    handleClickRemoveAllSections: (sections) => {
      sections.map((section) => dispatch(removeSection(section)))
    }
  }
}

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  toolbarMain: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
  },
  mainFeaturedPost: {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing.unit * 4,
  },
  mainFeaturedPostContent: {
    padding: `${theme.spacing.unit * 6}px`,
    [theme.breakpoints.up('md')]: {
      paddingRight: 0,
    },
  },
  mainGrid: {
    marginTop: theme.spacing.unit * 3,
  },
  card: {
    display: 'flex',
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
  markdown: {
    padding: `${theme.spacing.unit * 3}px 0`,
  },
  sidebarAboutBox: {
    padding: theme.spacing.unit * 2,
    backgroundColor: theme.palette.grey[200],
  },
  sidebarSection: {
    marginTop: theme.spacing.unit * 3,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 8,
    padding: `${theme.spacing.unit * 6}px 0`,
  },
});

export const SectionList = ({ handleClickRemoveSection, handleClickToggleSection, handleClickRemoveAllSections, publishSections, sections, ...rest}) => {
  const deleteSweepSection = `delete: ${[].concat(sections).length}`
  return (
    <Fragment>
    <br />
    <br />
    <br />
    <br />
    <br />
      <IconButton title={deleteSweepSection} onClick={() => {handleClickRemoveAllSections(sections)}}>
        <DeleteSweepIcon></DeleteSweepIcon>
      </IconButton>
      <AddSection />
      <Loading />

      <Grid>
        {sections.map((section) => {
          return (
            <Grid key={section.id}>
              <Card>
                <CardContent>
                  <Typography>
                    <RemoveSection
                      {...section}
                      onClick={() => {
                        handleClickRemoveSection(section)
                      }}
                    />
                    <span
                      style={{ textDecoration: section.muted ? 'line-through' : 'none' }}
                      onClick={() => {
                        handleClickToggleSection(section)
                      }}
                      title={section.muted ? 'enable' : 'diaable' }
                      >
                      {section.name}
                    </span>
                  </Typography>
                </CardContent>
              </Card>
              <p />
            </Grid>
          )
        }).reverse()
      }
      </Grid>
    </Fragment>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionList);
//export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SectionList));
