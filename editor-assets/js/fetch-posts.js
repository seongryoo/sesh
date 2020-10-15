const { withSelect } = wp.data;
const { apiFetch } = wp;

export const fetchPosts = function(postType, varName) {
  return withSelect(function(select) {
    const queryArgs = {
      per_page: -1,
      status: 'publish',
    };
    const posts = select('core').getEntityRecords(
        'postType',
        postType,
        queryArgs
    );
    return {
      [varName]: posts,
    };
  });
};
