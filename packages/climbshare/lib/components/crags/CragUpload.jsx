import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import {Components, registerComponent} from "meteor/vulcan:core";
import {CragFiles} from "../../modules/crags/files_collection";

const debug = require('debug')('demo:file');

class FileUploadComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploading: false,
      progress: 0,
      inProgress: false,
      message: 'uploadificateit'
    };

    this.uploadIt = this.uploadIt.bind(this);
  }
  uploadIt(e) {
    e.preventDefault();

    let self = this;

    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // there was multiple files selected
      var file = e.currentTarget.files[0];

      if (file) {
        let uploadInstance = CragFiles.insert({
          file: file,
          meta: {
            locator: self.props.fileLocator,
            userId: Meteor.userId() // Optional, used to check on server for file tampering
          },
          streams: 'dynamic',
          chunkSize: 'dynamic',
          allowWebWorkers: true // If you see issues with uploads, change this to false
        }, false)

        self.setState({
          uploading: uploadInstance, // Keep track of this instance to use below
          inProgress: true // Show the progress bar now
        });

        // These are the event functions, don't need most of them, it shows where we are in the process
        uploadInstance.on('start', function () {
          console.log('Starting');
        })

        uploadInstance.on('end', function (error, fileObj) {
          console.log('On end File Object: ', fileObj);
        })

        uploadInstance.on('uploaded', function (error, fileObj) {
          console.log('uploaded: ', fileObj);

          // Remove the filename from the upload box
          self.refs['fileinput'].value = '';

          // Reset our state for the next file
          self.setState({
            progress: 0,
            inProgress: false,
          });

          self.props.updateCurrentValues({[self.props.path]: fileObj._id})
        })

        uploadInstance.on('error', function (error, fileObj) {
          console.log('Error during upload: ' + error)
        });

        uploadInstance.on('progress', function (progress, fileObj) {
          console.log('Upload Percentage: ' + progress)
          // Update our progress bar
          self.setState({
            progress: progress
          });
        });

        uploadInstance.start(); // Must manually start the upload
      }
    }
  }

  render() {
    debug("Rendering FileUpload",this.props.docsReadyYet);


      return <div className="form-group row">
          <label className="control-label col-sm-3">
            Upload New File:
          </label>


          <div>
            <input type="file" id="fileinput" disabled={this.state.inProgress} ref="fileinput"
                   onChange={this.uploadIt}/>
                <div>
                  {!!this.state.uploading ?
                    <progress max={100} value={this.state.progress}>
                  {this.state.progress} %
                    </progress>
                    : null}
                </div>
          </div>
        </div>
  }
}

registerComponent({name: 'CragUpload', component: FileUploadComponent});

export default FileUploadComponent;
