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

export const SectionList = ({ handleClickRemoveSection, handleClickToggleSection, handleClickRemoveAllSections, publishSections, sections, ...rest}) => {
      const deleteSweepSection = `delete: ${[].concat(sections).length}`
  return (
    <Fragment>
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
