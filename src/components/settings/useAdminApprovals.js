import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { adminRequest, getAdminEnvironment, getAdminList } from "./adminApi";

export function useAdminApprovals(paths) {
  const { search } = useLocation();
  const { environment, apiBase, query, invalid } = getAdminEnvironment(search);
  const [loaded, setLoaded] = useState(null);
  const [failure, setFailure] = useState(null);
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState(0);
  const pathsKey = paths.join("|");

  useEffect(() => {
    if (invalid) return;
    const controller = new AbortController();
    async function load() {
      try {
        const lists = await Promise.all(pathsKey.split("|").map(path => getAdminList(apiBase, path, controller.signal)));
        if (!controller.signal.aborted) {
          setLoaded({ apiBase, lists });
          setFailure(null);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setLoaded(null);
          setFailure({ apiBase, message: `Could not load ${environment} approvals: ${err.message}` });
        }
      }
    }
    load();
    return () => controller.abort();
  }, [apiBase, environment, invalid, pathsKey, retry]);

  async function runAction(action) {
    if (busy) return;
    setBusy(true);
    setFailure(null);
    let approved = false;
    try {
      await action(async (path, options) => {
        const response = await adminRequest(apiBase, path, options);
        if (path.startsWith("/api/approve/") && options?.method === "POST") approved = true;
        return response;
      });
    } catch (err) {
      setFailure({
        apiBase,
        message: approved
          ? `The item was approved in ${environment}, but a later step failed: ${err.message} Check the pending list before retrying.`
          : `Could not complete the ${environment} approval action: ${err.message}`
      });
    } finally {
      setBusy(false);
    }
  }

  const data = loaded?.apiBase === apiBase ? loaded.lists : null;
  const error = invalid ? "Invalid approval environment. Select Development or Production." : failure?.apiBase === apiBase ? failure.message : "";
  const setData = update => setLoaded(current => {
    if (!current || current.apiBase !== apiBase) return current;
    return { apiBase, lists: typeof update === "function" ? update(current.lists) : update };
  });
  return { environment, apiBase, query, adminLink: `/settings/admin${query}`, data, setData, error, busy, runAction, retry: () => setRetry(value => value + 1) };
}
