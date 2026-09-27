<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Zejesh Clothes uses TanStack route pages with Lovable Cloud as the catalog, cart, and identity source because commerce state must persist securely.
- Product photography is bundled from `src/assets` and matched to products by slug because catalog records should remain portable and image delivery stays optimized by the app build.
