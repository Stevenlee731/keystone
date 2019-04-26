import isEqual from 'lodash.isequal';

export default class FieldController {
  constructor(config, list, adminMeta, views) {
    this.config = config;
    this.label = config.label;
    this.path = config.path;
    this.type = config.type;
    this.list = list;
    this.adminMeta = adminMeta;
    this.views = views;
  }

  // TODO: This is a bad default; we should (somehow?) inspect the fields provided
  // by the implementations gqlOutputFields
  getQueryFragment = () => this.path;

  // Prepare data for this field to be sent to the server as part of a GraphQL
  // mutation. It must be serialized into the format expected within the field's
  // Implementation#gqlCreateInputFields()/Implementation#gqlUpdateInputFields()
  // NOTE: This function is run synchronously
  serialize = data => data[this.config.path] || null;

  // When receiving data from the server, it needs to be processed into a
  // format ready for display. The format received will be the same as specified
  // in the field's Implementation#gqlOutputFields()
  // NOTE: This function is run synchronously
  deserialize = data => data[this.config.path];

  /**
   * @description Before sending data to the GraphQL server, this check is run to exclude
   * possibly expensive data from being sent. It also prevents issues where "no
   * change" can be destructive (eg; uploading a file - we no longer have the
   * file, so cannot update it and may accidentally send `null`).
   * @param initialData {Object} An object containing the most recently received
   * data from the server, keyed by the field's path. The values have already
   * been passed to this.serialize() for you.
   * @param initialData {Object} An object containing all of the data for the
   * current item, keyed by the field's path. The values have already been
   * passed to this.serialize() for you
   * @return boolean
   */
  hasChanged = async (initialData, currentData) =>
    isEqual(initialData[this.config.path], currentData[this.config.path]);

  // eslint-disable-next-line no-unused-vars
  getDefaultValue = data => this.config.defaultValue || '';
}