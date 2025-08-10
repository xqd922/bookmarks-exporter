import { Export } from "@/components/icons"
import { Progress } from "@/components/ui/progress"
import { AppContext } from "@/context/app-context"
import type { ChangedTreeData } from "@/types/bookmarks"
import { delay, processIconWithFallback, clearIconCache, getIconCacheStats } from "@/utils"
import { recursiveChange } from "@/utils/tree"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface ExportTreeDataProps {
  type: "folder" | "link"
  addDate: number
  title: string
  icon?: string // base64格式的图标数据
  iconUrl?: string // 原始图标URL作为备用
  url: string
}

function ExportPopup() {
  const navigate = useNavigate()
  const { treeData, setTreeData } = useContext(AppContext)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState("准备导出...")
  const [processedCount, setProcessedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  // 计算总的链接数量
  const countLinks = (data: ChangedTreeData[]): number => {
    let count = 0;
    const traverse = (items: ChangedTreeData[]) => {
      items.forEach(item => {
        if (item.type === "link") {
          count++;
        }
        if (item.children) {
          traverse(item.children as ChangedTreeData[]);
        }
      });
    };
    traverse(data);
    return count;
  }

  const exportData = async () => {
    // 清理之前的缓存
    clearIconCache();
    
    // 计算总数
    const total = countLinks(treeData as ChangedTreeData[]);
    setTotalCount(total);
    setStatusText(`正在处理 ${total} 个书签...`);
    
    let processed = 0;
    
    // 处理数据
    const bookmarks = await recursiveChange<
      ChangedTreeData,
      ExportTreeDataProps
    >(treeData as ChangedTreeData[], async (item, _index: number) => {
      if (item.type === "link") {
        setStatusText(`正在获取图标: ${item.title}`);
        const iconData = await processIconWithFallback(item.url);
        
        processed++;
        setProcessedCount(processed);
        const progressPercent = Math.floor((processed / total) * 80) + 20; // 20-100%
        setProgress(progressPercent);
        
        return {
          type: item.type,
          addDate: item.dateAdded,
          title: item.title,
          ...iconData, // 包含 icon 和 iconUrl 字段
          url: item.url
        }
      }
      return {
        type: item.type,
        addDate: item.dateAdded,
        title: item.title,
        url: item.url
      }
    })

    setStatusText("导出完成！");
    const cacheStats = getIconCacheStats();
    console.log(`Export completed. Processed ${processed} links, cached ${cacheStats.size} unique domains.`);
    
    setTreeData(bookmarks)
  }

  useEffect(() => {
    const timer = setTimeout(async () => {
      setProgress(10)
      setStatusText("初始化导出...")
      await delay(300)
      
      setProgress(20)
      setStatusText("开始处理书签...")
      await delay(200)
      
      await exportData()
      
      setProgress(100)
      setStatusText("导出完成！")
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress === 100) {
        navigate("/finish")
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className="py-6 w-[300px] flex flex-col items-center justify-center">
      <Export className="w-32 h-32" />

      <div className="px-8 w-full mt-4 mb-10">
        <Progress className="h-2" value={progress} />
      </div>

      <div className="px-10 w-full space-y-3 text-center">
        <h1 className="text-xl">正在导出...</h1>
        <p className="text-zinc-500 text-sm font-light">
          {statusText}
        </p>
        {totalCount > 0 && (
          <p className="text-zinc-400 text-xs">
            已处理: {processedCount} / {totalCount}
          </p>
        )}
        <p className="text-zinc-500 text-lg font-light">
          请稍候，这可能需要一些时间
        </p>
      </div>
    </div>
  )
}

export default ExportPopup
