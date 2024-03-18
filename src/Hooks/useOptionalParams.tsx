const useOptionalParams = () => {
  const url = new URL(window.location.href);
  const getParams = (params: string) => {
    return url.searchParams.get(params);
  };

  return { getParams };
};

export default useOptionalParams;
