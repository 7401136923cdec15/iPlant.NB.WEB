namespace iPlant.Data.EF.Repository
{
    public class Pagination
    {
        public Pagination()
        {
            Sort = "ID"; // 默认按Id排序
            SortType = " desc ";
            PageIndex = 1;
            PageSize = 10;
        }

        public static Pagination Create(int wPageIndex, int wPageSize, params string[] args)
        {
            Pagination wResult = new Pagination();

            wResult.PageIndex = wPageIndex;
            wResult.PageSize = wPageSize;
            if (args == null)
                return wResult;
            if (args.Length > 0)
                wResult.Sort = args[0];
            if (args.Length > 1)
                wResult.SortType = args[1]; 
            return wResult;
        }

        /// <summary>
        /// 每页行数
        /// </summary>
        public int PageSize { get; set; }
        /// <summary>
        /// 当前页
        /// </summary>
        public int PageIndex { get; set; }
        /// <summary>
        /// 排序列
        /// </summary>
        public string Sort { get; set; }
        /// <summary>
        /// 排序类型
        /// </summary>
        public string SortType { get; set; }
        /// <summary>
        /// 总记录数
        /// </summary>
        public int TotalCount { get; set; }
        /// <summary>
        /// 总页数
        /// </summary>
        public int TotalPage
        {
            get
            {
                if (TotalCount > 0)
                {
                    return TotalCount % this.PageSize == 0 ? TotalCount / this.PageSize : TotalCount / this.PageSize + 1;
                }
                else
                {
                    return 0;
                }
            }
        }
    }
}
